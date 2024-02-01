import React from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { likeAPost, adminData } from "@/app/utils/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function LikeDislike({ like, id }) {
  const queryClient = useQueryClient();
  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });

  const mutation = useMutation({
    mutationFn: likeAPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const handleLike = () => {
    mutation.mutate();
  };

  return (
    <div className="flex gap-3">
      {like.includes(Admin?._id) ? (
        <div>
          <button onClick={handleLike}>
            <span>
              <GoHeartFill className="text-[1.5rem] text-[red]" />
            </span>
          </button>
        </div>
      ) : (
        <div>
          <button onClick={handleLike}>
            <span>
              <GoHeart className="text-[1.5rem]" />
            </span>
          </button>
        </div>
      )}
      <div>
        <p>{like.length}</p>
      </div>
    </div>
  );
}

export default LikeDislike;
