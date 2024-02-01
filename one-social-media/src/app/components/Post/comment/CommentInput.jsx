import React, { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { adminData, replyCommentMod } from "@/app/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CommentInput = ({ uid }) => {
  const [comment, setComment] = useState("");
  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  const url = Admin?.profileUrl.url;
  const from = Admin?.firstname + " " + Admin?.lastname;

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  const queryClient = useQueryClient();
  const mutationReply = useMutation({
    mutationFn: () => replyCommentMod(comment, from, url, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setComment("");
    },
  });

  const postman = () => {
    mutationReply.mutate();
  };

  return (
    <>
      <div className="flex justify-between">
        <input
          type="text"
          className="bg-black text-white w-full max-md:h-8 h-10 focus:outline-none focus:border-gray-800 max-md:text-[0.7rem] "
          placeholder="reply comment .."
          value={comment}
          onKeyDown={(event) => {
            if (event.key === "Enter") postman();
          }}
          onChange={handleChangeComment}
        />
        {comment && (
          <button
            type="submit"
            className="h-10 max-md:h-8 bg-black text-[1rem] max-md:text-[0.7rem]  flex justify-center items-center text-black"
            onClick={postman}
          >
            <p className="text-[gray] mx-1 hover:text-[#fff]">send</p>
            <LuSendHorizonal className="max-md:text-[0.7rem] text-[gray] hover:text-[#fff]" />
          </button>
        )}
      </div>
    </>
  );
};

export default CommentInput;
