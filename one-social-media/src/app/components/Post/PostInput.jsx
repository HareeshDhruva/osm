import React, { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { makeAComment } from "@/app/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PostInput = ({ uid }) => {
  const [comment, setComment] = useState("");
  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      await makeAComment(comment, uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setComment("");
    },
  });

  const postman = () => {
    mutation.mutate();
  };

  return (
    <div className="flex justify-center container mx-6">
      <input
        type="text"
        className="bg-black text-white w-full max-md:h-8 h-10 focus:outline-none focus:border-gray-800 max-md:text-[0.7rem]"
        placeholder="comment ..."
        value={comment}
        id="comment"
        onKeyDown={(event) => {
          if (event.key === "Enter") postman();
        }}
        onChange={handleChangeComment}
      />
      {comment && (
        <button
          type="submit"
          className="h-10 max-md:h-8 bg-black flex justify-center items-center text-black"
          onClick={postman}
        >
          <LuSendHorizonal className="max-md:text-[1rem] text-3xl mx-2 text-[gray] hover:text-[#fff]" />
        </button>
      )}
    </div>
  );
};

export default PostInput;
