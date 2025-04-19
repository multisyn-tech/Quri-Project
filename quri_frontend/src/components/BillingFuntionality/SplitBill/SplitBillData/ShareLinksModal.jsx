const ShareLinksModal = ({ showModal, setShowModal, sessions }) => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Split Bill Links</h2>
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {sessions.map((s, i) => (

              <li key={i} className="border p-3 rounded-md">

                <p className="mb-2 text-sm font-medium">Person {i + 1}</p>

                <div className="flex items-center space-x-2">
                <a
                  href={s.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded px-2 py-1 flex-1 text-sm w-10"
                >
                  Click to Pay
                </a>

                  <button
                    onClick={() => navigator.clipboard.writeText(s.paymentLink)}
                    className="bg-blue-500 text-white text-sm px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(s.paymentLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white text-sm px-2 py-1 rounded"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
  
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 w-full bg-gray-300 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default ShareLinksModal;
  