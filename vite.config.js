import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { BedrockRuntimeClient, ConverseCommand, InvokeModelCommand } = require('./functions/node_modules/@aws-sdk/client-bedrock-runtime');

async function callUniversalBedrock({ accessKey, secretKey, defaultRegion, requestedModel, requestData }) {
  // Normalize model ID
  let chosenModel = requestedModel || 'us.moonshotai.kimi-k3';
  if (chosenModel.includes('kimi') || chosenModel.includes('moonshot')) {
    chosenModel = 'us.moonshotai.kimi-k3';
  } else if (chosenModel.startsWith('claude-')) {
    // If a legacy Claude ID was passed, fallback to active Bedrock model
    chosenModel = process.env.BEDROCK_MODEL_ID || 'us.moonshotai.kimi-k3';
  }

  // Determine effective region (us.* cross-region inference profiles require us-east-1)
  let effectiveRegion = defaultRegion || 'eu-north-1';
  if (chosenModel.startsWith('us.') && (effectiveRegion.startsWith('eu-') || effectiveRegion.startsWith('ap-'))) {
    effectiveRegion = 'us-east-1';
  } else if (chosenModel.startsWith('eu.') && !effectiveRegion.startsWith('eu-')) {
    effectiveRegion = 'eu-central-1';
  }

  console.log(`[Bedrock Dev API] Invoking ${chosenModel} via ${effectiveRegion}...`);

  const client = new BedrockRuntimeClient({
    region: effectiveRegion,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  const isConverse = chosenModel.includes('moonshot') || chosenModel.includes('kimi') || chosenModel.includes('nova');

  if (isConverse) {
    // Format messages for Bedrock Converse API
    const formattedMessages = (requestData.messages || []).map(m => {
      let contentList = [];
      if (typeof m.content === 'string') {
        contentList = [{ text: m.content }];
      } else if (Array.isArray(m.content)) {
        contentList = m.content.map(c => {
          if (c.type === 'text') return { text: c.text };
          if (c.text) return { text: c.text };
          return { text: JSON.stringify(c) };
        });
      } else {
        contentList = [{ text: String(m.content || '') }];
      }
      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: contentList
      };
    });

    const inferenceConfig = {
      maxTokens: requestData.max_tokens || 2048
    };

    // Moonshot Kimi K3 does NOT support the temperature parameter
    if (!chosenModel.includes('kimi') && requestData.temperature !== undefined) {
      inferenceConfig.temperature = requestData.temperature;
    }

    const converseParams = {
      modelId: chosenModel,
      messages: formattedMessages,
      inferenceConfig
    };

    if (requestData.system) {
      const sysText = typeof requestData.system === 'string'
        ? requestData.system
        : (Array.isArray(requestData.system) ? requestData.system.map(s => s.text || '').join('\n') : String(requestData.system));
      converseParams.system = [{ text: sysText }];
    }

    const response = await client.send(new ConverseCommand(converseParams));
    const contentItems = response.output?.message?.content || [];
    const textItem = contentItems.find(c => typeof c.text === 'string' && c.text.length > 0);
    const text = textItem ? textItem.text : '';

    return {
      id: 'bedrock-' + Date.now(),
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: text
        }
      ],
      model: chosenModel,
      stop_reason: response.stopReason || 'end_turn',
      usage: {
        input_tokens: response.usage?.inputTokens || 0,
        output_tokens: response.usage?.outputTokens || 0
      }
    };
  } else {
    // Anthropic InvokeModel API
    const bedrockPayload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: requestData.max_tokens || 4096,
      messages: requestData.messages,
      ...(requestData.system ? { system: requestData.system } : {}),
      ...(requestData.temperature !== undefined ? { temperature: requestData.temperature } : {}),
      ...(requestData.top_p !== undefined ? { top_p: requestData.top_p } : {}),
      ...(requestData.stop_sequences ? { stop_sequences: requestData.stop_sequences } : {}),
    };

    const command = new InvokeModelCommand({
      modelId: chosenModel,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(bedrockPayload),
    });

    const bedrockResponse = await client.send(command);
    return JSON.parse(new TextDecoder().decode(bedrockResponse.body));
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'bedrock-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/callClaude', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const requestData = JSON.parse(body || '{}');
                const accessKey = env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
                const secretKey = env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
                const defaultRegion = env.AWS_REGION || process.env.AWS_REGION || 'eu-north-1';
                const requestedModel = requestData.model || env.BEDROCK_MODEL_ID || process.env.BEDROCK_MODEL_ID || 'us.moonshotai.kimi-k3';

                const result = await callUniversalBedrock({
                  accessKey,
                  secretKey,
                  defaultRegion,
                  requestedModel,
                  requestData
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } catch (err) {
                console.error('[Bedrock Dev API Error]:', err);
                const statusCode = err.$metadata?.httpStatusCode || err.statusCode || 500;
                res.statusCode = statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: err.message || 'Bedrock Error', name: err.name }));
              }
            });
          });
        }
      }
    ],
    server: {
      port: 5173
    },
    build: {
      chunkSizeWarningLimit: 3000
    }
  };
});
