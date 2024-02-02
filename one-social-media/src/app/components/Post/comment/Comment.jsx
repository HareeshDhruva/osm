import React from "react";
import { Dialog, AppBar, Toolbar, Typography, Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import AvatarBlock from "../../Avatar";
import { ReplyAvatarBlock } from "../../ReplyAvatar";
import CommentInput from "./CommentInput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPost, likeAcomment } from "@/app/utils/api";
import { SlLike } from "react-icons/sl";

const Comment = ({ open, setOpen, id }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const { data: Post } = useQuery({ queryKey: ["post"], queryFn: getAllPost });
  const commentList =
    Post.find((item) => item._id === id && item.comments) || null;

  const mutation = useMutation({
    mutationFn: (data) => likeAcomment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const sendRequest = (id, rid) => {
    const data = { id, rid };
    mutation.mutate(data);
  };

  return (
    <>
      {commentList !== null && (
        <React.Fragment>
          <Dialog fullScreen open={open} onClose={handleClose}>
            <AppBar sx={{ position: "relative", bgcolor: "#000" }}>
              <Toolbar>
                <div className="flex justify-between w-full">
                  <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
                    Comments
                  </p>
                  <IconButton edge="end" color="inherit" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            <div className="h-[100dvh] bg-black overflow-hidden">
              <div className="flex justify-evenly items-center max-md:flex-col">
                <div className="flex justify-center items-center md:w-[40%]">
                  <img src={commentList.image.url} alt="profile" />
                </div>
                <div className="overflow-scroll md:h-[80vh] max-md:h-[20rem] w-1/2 max-md:w-full max-md:m-4">
                  {commentList?.comments?.map((comments) => (
                    <List>
                      <ListItem button>
                        <div className="w-[100%]">
                          <AvatarBlock
                            url={comments?.userId?.profileUrl?.url}
                            data={
                              "@ " +
                              comments.userId.firstname +
                              "_" +
                              comments.userId.lastname
                            }
                          />
                          <ListItemText
                            sx={{
                              marginLeft: 1,
                              color: "#fff",
                              fontWeight: 700,
                            }}
                            primary={comments.comment}
                          />
                          {comments.replies.map((result) => result.comment) && (
                            <div className="m-2 rounded">
                              {comments?.replies?.map((repl) => (
                                <>
                                  <div className="md:mx-10 p-2 rounded-lg m-1 ring-1 ring-gray-500">
                                    {repl && (
                                      <>
                                        <ReplyAvatarBlock
                                          url={repl.url}
                                          data={repl.from}
                                          className="w-10"
                                        />
                                        <p className="text-xs text-white font-bold p-2 cursor-pointer max-md:text-[0.7rem] ">
                                          {repl.comment}
                                        </p>
                                        <div className="flex justify-between">
                                          <p className="text-[#fff] text-sm max-md:text-[0.7rem] ">
                                            {repl.likes.length} likes{" "}
                                          </p>

                                          <SlLike
                                            className="text-[#fff]"
                                            onClick={(e) =>
                                              sendRequest(
                                                comments._id,
                                                repl._id
                                              )
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </>
                              ))}
                              <CommentInput uid={comments._id} />
                            </div>
                          )}
                        </div>
                      </ListItem>
                    </List>
                  ))}
                </div>
              </div>
            </div>
          </Dialog>
        </React.Fragment>
      )}
    </>
  );
};

export default Comment;
