export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}