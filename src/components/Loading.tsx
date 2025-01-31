const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        <div className="w-12 h-12 border-4 border-[#4255ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
