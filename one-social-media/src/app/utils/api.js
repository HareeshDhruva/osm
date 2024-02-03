import axios from "axios";
const URL = process.env.NEXT_PUBLIC_BACKEND;
const token =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

export const adminData = async () => {
  const res = await axios.post(`${URL}/getuser`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.data;
};

export const getUser = async (id) => {
  const res = await axios.post(`${URL}/getuser/${id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (res.status === 200) {
    return res.data.data;
  }
};

export const suggestionMode = async () => {
  const res = await axios.post(`${URL}/suggested`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (res.status === 200) {
    return res.data.data;
  }
};

export const friendRequestMode = async () => {
  const res = await axios.post(`${URL}/getFriendRequest`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.data;
};

export const friendRequestAcceptMode = async (data) => {
  const res = await axios.post(`${URL}/acceptFriendRequest`, {
    data: data,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (res.status === 200) {
    console.log(res.data);
  }
};

export const updateProfilePhoto = (data) => {
  return async (dispatch) => {
    await axios.post(`${URL}/updateProfilePhoto`, {
      data: data,
      headers: {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  };
};

export const sendFriendRequestMod = async (requestId) => {
  const res = await axios.post(`${URL}/sendFriendRequest`, {
    data: requestId,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.message;
};

export const getAllPost = async () => {
  const res = await axios.get(`${URL}`);
  return res.data.data;
};

export const likeAPost = (id) => {
  return async (dispatch) => {
    await axios
      .post(`${URL}/like/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
};

export const getComment = async (id) => {
  const res = await axios.get(`${URL}/comment/${id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.data;
};

export const makeAComment = async (data, id) => {
  if (data) {
    return await axios.post(`${URL}/comment-post/${id}`, {
      comment: data,
      headers: {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  }
};

export const replyCommentMod = async (comment, from, url, id) => {
  if (comment) {
    const data = { comment, from, url };
    return await axios.post(`${URL}/reply-comment/${id}`, {
      data: data,
      headers: {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  }
};

export const getUserPost = async (id) => {
  const res = await axios.post(`${URL}/get-user-post/${id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (res.status == 200) {
    return res.data.data;
  }
};


export const updateUser = async (pagedata) => {
  const response = await axios.post(`${URL}/updateUser`, {
    data: pagedata,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data.data;
};

export const likeAcomment = async (data) => {
  const { id, rid } = data;
  return await axios.post(`${URL}/like-comment/${id}/${rid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export const deletePost = async (id) => {
  return await axios.post(`${URL}/delete-post/${id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export const deleteFriend = async (data) => {
  const res = await axios.post(`${URL}/deleteFriend`, {
    data: data,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data.message;
};

export const profileUpdate = async(file)=>{
  console.log(file)
  return await axios.post(`${URL}/updateProfilePhoto`, {
    method: "POST",
    data:file,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
}
 
export const makeApost = async (description, image) => {
  const data = { description, image };
  return await axios.post(`${URL}/create-post`, {
    data: data,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};