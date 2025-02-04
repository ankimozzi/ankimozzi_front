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
        <title>Duel | 홈</title>
        <meta name="description" content="AI가 만드는 Quizlet 덱, Duel" />
        <meta name="keywords" content="Duel, Quizlet, AI, 학습, 암기, 교육" />
        <meta property="og:title" content="Duel | 홈" />
        <meta
          property="og:description"
          content="AI가 만드는 Quizlet 덱, Duel"
        />
        <link rel="canonical" href="https://your-domain.com" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white">
        {/* 헤더 섹션 */}
        <header className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
          >
            AI가 만드는 Quizlet 덱,{" "}
            <span className="block sm:inline">Duel 🚀</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 whitespace-normal break-keep"
          >
            학습 콘텐츠 제작, 아직도 수작업으로 하시나요?
          </motion.p>
          <p className="text-lg text-gray-300 mb-8">
            Duel은 영상을 업로드하는 것만으로 AI가 자동으로 Quizlet 덱을
            생성하는 서비스입니다.
          </p>
          <Link
            to="/decks"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            둘러보기
          </Link>
        </header>

        {/* 타겟 사용자 섹션 */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center whitespace-normal break-keep">
            ✨ 이런 분들을 위해 만들었어요
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🎓"
              title="교육자"
              description="강의 영상에서 퀴즈를 만들어 학생들에게 공유하고 싶은 교육자"
            />
            <FeatureCard
              icon="📚"
              title="학생"
              description="영상 콘텐츠로 자기주도 학습을 하고 싶은 학생"
            />
            <FeatureCard
              icon="💡"
              title="EdTech 개발자"
              description="AI 기반 학습 콘텐츠 제작을 고민하는 EdTech 개발자"
            />
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="container mx-auto px-4 py-16 bg-white/5">
          <h2 className="text-3xl font-bold mb-8 text-center">
            ✨ Duel이 특별한 이유
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon="🔹"
              title="자동 퀴즈 덱 생성"
              description="영상만 올리면 AI가 주요 개념을 분석해 즉시 Quizlet 덱으로 변환합니다."
            />
            <FeatureCard
              icon="🔹"
              title="20M+ 사용자를 처리하는 서버리스 인프라"
              description="확장성이 뛰어난 AWS 기반 서버리스 구조로 안정적인 서비스 제공."
            />
            <FeatureCard
              icon="🔹"
              title="AI 기반 최적화"
              description="퀴즈 생성 프로세스를 카테고리 기반으로 최적화해, Quizlet 운영 비용 대비 4% 수준으로 효율적으로 운영합니다."
            />
            <FeatureCard
              icon="🔹"
              title="자동화된 인프라 관리"
              description="Terraform을 활용한 AWS 리소스 배포 및 관리까지 자동화하여 유지보수 부담을 최소화했습니다."
            />
          </div>
        </section>

        {/* 팀 소개 섹션 */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            👨‍💻 만든 사람들
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TeamMember
              name="김기훈"
              role="Backend Engineer"
              description="확장 가능한 영상 처리 파이프라인 개발 및 비용 계산"
              linkedIn="kihoon-noah-kim"
            />
            <TeamMember
              name="김동연"
              role="Full-stack Engineer"
              description="프론트엔드 개발 & 영상 저장/퀴즈 변환 워크플로우 구현 및 아키텍쳐 설계"
              linkedIn="yeonnnn"
            />
            <TeamMember
              name="나덕룡 (Nathan)"
              role="Front Engineer, Market Research Analyst"
              description="프론트엔드 개발 & 시장 조사, 비즈니스 전략 수립 및 비용 계산"
              linkedIn="deokryongna"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
