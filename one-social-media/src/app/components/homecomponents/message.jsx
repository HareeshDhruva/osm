import React from "react";
import Link from 'next/link'

const Message = () => {
  return (
    <Link href='/chat'>
    <div className="flex justify-center items-center rounded-3xl ring-1 p-1 bg-white">
      <button
        type="submit"
        className="py-2 px-4 uppercase font-bold"
      >
        Message
      </button>
    </div>
    </Link>
  );
};

export default Message;
