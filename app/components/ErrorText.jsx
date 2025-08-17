export default function ErrorText({ message, center = false }) {
  if (!message) return null;

  return (
    <p className={`text-red-500 text-sm mt-1 ${center ? "text-center mt-2" : ""}`}>
      {message}
    </p>
  );
}
