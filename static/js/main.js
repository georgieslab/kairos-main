const { useState, useEffect } = React;
const { Book, Heart, Sparkles, PenTool, Brain, Compass, Smile, Star } = lucide;

const JourneyPaths = () => {
    const [selectedPath, setSelectedPath] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Show welcome message for 1.5 seconds
        setTimeout(() => {
            setShowWelcome(false);
            setShowContent(true);
        }, 1500);
    }, []);

    const journeyPaths = [
        {
            id: 1,
            icon: <Compass className="w-5 h-5" />,
            title: "10-Day Introduction",
            description: "Get to know yourself and our journaling method",
            details: "Perfect for beginners. Discover the power of mindful journaling with guided prompts and AI-powered insights. Start your journey with simple, guided exercises that build your journaling practice.",
            duration: "10 days",
            intensity: "Light",
            color: "from-blue-500 to-cyan-400",
            buttonColor: "bg-blue-600 hover:bg-blue-500",
            borderColor: "border-blue-400/30"
        },
        {
            id: 2,
            icon: <Brain className="w-5 h-5" />,
            title: "Personality Insights",
            description: "Explore and understand your personal traits",
            details: "Through daily reflection and AI analysis, uncover your core personality traits and behavioral patterns. Gain deep insights into your thinking and decision-making styles.",
            duration: "10 days",
            intensity: "Medium",
            color: "from-purple-500 to-pink-400",
            buttonColor: "bg-purple-600 hover:bg-purple-500",
            borderColor: "border-purple-400/30"
        },
        {
            id: 3,
            icon: <Heart className="w-5 h-5" />,
            title: "Gratitude Journey",
            description: "Cultivate daily gratitude practice",
            details: "Transform your perspective through structured gratitude exercises. Develop a deeper appreciation for life's moments and build a positive mindset through regular practice.",
            duration: "10 days",
            intensity: "Medium",
            color: "from-rose-500 to-red-400",
            buttonColor: "bg-rose-600 hover:bg-rose-500",
            borderColor: "border-rose-400/30"
        },
        {
            id: 4,
            icon: <PenTool className="w-5 h-5" />,
            title: "Freestyle Writing",
            description: "Express yourself without boundaries",
            details: "Let your thoughts flow freely while our AI provides insight into your writing patterns and emotions. Perfect for experienced journal writers who want deeper analysis of their practice.",
            duration: "Ongoing",
            intensity: "Flexible",
            color: "from-amber-500 to-yellow-400",
            buttonColor: "bg-amber-600 hover:bg-amber-500",
            borderColor: "border-amber-400/30"
        },
        {
            id: 5,
            icon: <Sparkles className="w-5 h-5" />,
            title: "Pattern Recognition",
            description: "Discover insights in your journal entries",
            details: "Advanced AI analysis reveals patterns in your thoughts, emotions, and behaviors over time. Understand your personal trends and growth opportunities.",
            duration: "Ongoing",
            intensity: "Deep",
            color: "from-emerald-500 to-teal-400",
            buttonColor: "bg-emerald-600 hover:bg-emerald-500",
            borderColor: "border-emerald-400/30"
        },
        {
            id: 6,
            icon: <Smile className="w-5 h-5" />,
            title: "Emotional Growth",
            description: "Develop emotional intelligence",
            details: "Focus on understanding and managing your emotions through structured journaling exercises. Build self-awareness and emotional resilience.",
            duration: "15 days",
            intensity: "Medium",
            color: "from-violet-500 to-indigo-400",
            buttonColor: "bg-violet-600 hover:bg-violet-500",
            borderColor: "border-violet-400/30"
        },
        {
            id: 7,
            icon: <Star className="w-5 h-5" />,
            title: "Goal Achievement",
            description: "Track and achieve your goals",
            details: "Set meaningful goals and track your progress through focused journaling. AI insights help identify obstacles and opportunities for success.",
            duration: "20 days",
            intensity: "High",
            color: "from-orange-500 to-red-400",
            buttonColor: "bg-orange-600 hover:bg-orange-500",
            borderColor: "border-orange-400/30"
        },
        {
            id: 8,
            icon: <Book className="w-5 h-5" />,
            title: "Custom Journey",
            description: "Create your own path",
            details: "Design your personal journaling experience with customizable prompts and flexible AI guidance. Perfect for those who want to chart their own course.",
            duration: "Custom",
            intensity: "Custom",
            color: "from-indigo-500 to-violet-400",
            buttonColor: "bg-indigo-600 hover:bg-indigo-500",
            borderColor: "border-indigo-400/30"
        }
    ];

    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        // Smooth scroll to show details if on mobile
        if (window.innerWidth < 768) {
            const element = document.getElementById(`path-${pathId}`);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleStartJourney = (pathId) => {
        // Add your journey start logic here
        console.log(`Starting journey: ${pathId}`);
    };

    return (
        <div className="relative min-h-screen">
            {/* Welcome Message */}
            <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 
                ${showWelcome ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-4xl font-bold text-emerald-400">
                    Begin Your Journey
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {journeyPaths.map((path) => (
                        <div
                            key={path.id}
                            id={`path-${path.id}`}
                            className={`
                                relative p-4 rounded-lg cursor-pointer
                                transition-all duration-500 ease-out
                                border-2 ${path.borderColor}
                                backdrop-blur-sm
                                ${selectedPath === path.id 
                                    ? 'bg-gray-900/90' 
                                    : 'bg-gray-900/40 hover:bg-gray-900/60'
                                }
                                group
                                hover:border-opacity-100
                                hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                            `}
                            onClick={() => handlePathSelect(path.id)}
                        >
                            {/* Hover gradient effect */}
                            <div className={`
                                absolute inset-0 rounded-lg opacity-0 
                                group-hover:opacity-10 transition-opacity duration-500
                                bg-gradient-to-br ${path.color}
                            `} />

                            <div className="relative flex items-start space-x-3">
                                <div className={`
                                    p-2 rounded-lg
                                    transition-colors duration-300
                                    ${selectedPath === path.id ? path.buttonColor : 'bg-gray-800'}
                                `}>
                                    {path.icon}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-1">{path.title}</h3>
                                    <p className="text-gray-300 text-sm mb-2">{path.description}</p>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-gray-400">
                                            <span className="font-medium mr-2">Duration:</span>
                                            {path.duration}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <span className="font-medium mr-2">Intensity:</span>
                                            {path.intensity}
                                        </div>
                                    </div>

                                    {selectedPath === path.id && (
                                        <div className="mt-3 p-3 rounded bg-gray-800/50 border border-gray-700
                                            animate-fade-in">
                                            <p className="text-xs text-gray-300">{path.details}</p>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartJourney(path.id);
                                                }}
                                                className={`
                                                    mt-3 w-full py-2 px-3 rounded
                                                    transition-all duration-300 text-sm
                                                    ${path.buttonColor}
                                                    transform hover:scale-[1.02]
                                                    shadow-lg hover:shadow-xl
                                                `}
                                            >
                                                Begin This Journey
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Render the React component
ReactDOM.render(
    <JourneyPaths />,
    document.getElementById('root')
);