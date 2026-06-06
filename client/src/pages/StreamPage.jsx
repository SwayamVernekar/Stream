// ─────────────────────────────────────────────────────────
//  Stream Page — Watch a live stream
// ─────────────────────────────────────────────────────────

import { useParams } from "react-router-dom";

const StreamPage = () => {
  const { streamKey } = useParams();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">📺 Stream</h1>
      <p className="text-gray-400">
        Watching stream: <span className="text-purple-400 font-mono">{streamKey}</span>
      </p>
    </div>
  );
};

export default StreamPage;
