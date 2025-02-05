import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="p-6 rounded-lg bg-white/5 backdrop-blur-sm"
  >
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300 whitespace-normal break-keep">{description}</p>
  </motion.div>
);

const TeamMember = ({
  name,
  role,
  description,
  linkedIn,
}: {
  name: string;
  role: string;
  description: string;
  linkedIn: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="group p-6 rounded-lg bg-white/5 backdrop-blur-sm 
      transition-all duration-300 cursor-pointer
      hover:bg-white/10 hover:shadow-lg hover:-translate-y-1
      hover:ring-1 hover:ring-white/20"
    onClick={() =>
      window.open(`https://www.linkedin.com/in/${linkedIn}`, "_blank")
    }
    onKeyDown={(e) =>
      e.key === "Enter" &&
      window.open(`https://www.linkedin.com/in/${linkedIn}`, "_blank")
    }
    tabIndex={0}
    role="link"
    aria-label={`Visit ${name}'s LinkedIn profile`}
  >
    <h3 className="text-xl font-bold mb-2">{name}</h3>
    <p className="text-blue-400 mb-2">{role}</p>
    <p className="text-gray-300 whitespace-normal break-keep">{description}</p>
  </motion.div>
);

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Duel | Home</title>
        <meta name="description" content="Duel: AI-generated Quizlet decks" />
        <meta
          name="keywords"
          content="Duel, Quizlet, AI, learning, memorization, education"
        />
        <meta property="og:title" content="Duel | Home" />
        <meta
          property="og:description"
          content="Duel: AI-generated Quizlet decks"
        />
        <link rel="canonical" href="https://your-domain.com" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white">
        {/* Header Section */}
        <header className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
          >
            Duel: AI-Generated Quizlet Decks{" "}
            <span className="block sm:inline">🚀</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 whitespace-normal break-keep"
          >
            Still creating study content manually?
          </motion.p>
          <p className="text-lg text-gray-300 mb-8">
            Duel is a service that automatically generates Quizlet decks using
            AI, simply by uploading a video.
          </p>
          <Link
            to="/decks"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Explore
          </Link>
        </header>

        {/* Target Audience Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center whitespace-normal break-keep">
            ✨ Created for People Like You
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🎓"
              title="Educators"
              description="Educators who want to create quizzes from lecture videos to share with their students."
            />
            <FeatureCard
              icon="📚"
              title="Students"
              description="Students who want to engage in self-directed learning through video content."
            />
            <FeatureCard
              icon="💡"
              title="EdTech Developers"
              description="EdTech developers focused on AI-driven learning content creation."
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 bg-white/5">
          <h2 className="text-3xl font-bold mb-8 text-center">
            ✨ What Makes Duel Special
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon="🔹"
              title="Automated Quiz Deck Generation"
              description="Simply upload a video, and AI analyzes key concepts to instantly convert them into a Quizlet deck."
            />
            <FeatureCard
              icon="🔹"
              title="Serverless Infrastructure for 20M+ Users"
              description="Providing reliable service with a scalable AWS-based serverless architecture."
            />
            <FeatureCard
              icon="🔹"
              title="AI-Driven Optimization"
              description="Optimized quiz generation processes by category, operating at approximately 4% of Quizlet's operating costs."
            />
            <FeatureCard
              icon="🔹"
              title="Automated Infrastructure Management"
              description="Automated AWS resource deployment and management using Terraform to minimize maintenance burdens."
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            👨‍💻 Meet the Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TeamMember
              name="김기훈"
              role="Backend Engineer"
              description="Developed scalable video processing pipelines and performed cost calculations."
              linkedIn="kihoon-noah-kim"
            />
            <TeamMember
              name="김동연"
              role="Full-stack Engineer"
              description="Implemented frontend development, video storage, and quiz conversion workflows, and designed the architecture."
              linkedIn="yeonnnn"
            />
            <TeamMember
              name="나덕룡 (Nathan)"
              role="Front Engineer, Market Research Analyst"
              description="Worked on frontend development, market research, business strategy planning, and cost calculations."
              linkedIn="deokryongna"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
