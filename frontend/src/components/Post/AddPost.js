import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { axiosApi } from "../../axios";
import { PostContext } from "../Dashboard";
import { useNavigate } from "react-router-dom";

function AddPost() {

  const navigate = useNavigate()

  const {postDispatch} = useContext(PostContext)
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFileType("image");
      } else if (selectedFile.type.startsWith("video/")) {
        setFileType("video");
      } else {
        setFileType("unsupported");
      }
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);
    formData.append("mediaType", fileType);
    console.log(formData);

    try {
      const res = await axiosApi.post("/post", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const result = res.data;
      postDispatch({ type: "ADD_POST", payload: result });
      toast.success("posted successfully", { autoClose: 1000 });
      setFile(null);
      setCaption("");
      setPreviewUrl(null)
      navigate('/dashboard')
      
    } catch (err) {
      console.log(err);
      toast.error("something went wrong..!", { autoClose: 1000 });
    }
  };

  return (
    <div className="form-box">
      <form>
        <input type="file" onChange={handleFileChange} /> <br />
        {fileType === "image" && (
          <div>
            <img src={previewUrl} alt="Preview" style={{ width: "300px" }} />
          </div>
        )}
        {fileType === "video" && (
          <div>
            <video controls style={{ width: "300px" }}>
              <source src={previewUrl} type="video/mp4" />
            </video>
          </div>
        )}
        {fileType === "unsupported" && <p>Unsupported file type.</p>}
        <label htmlFor="caption " className="mt-2">
          Caption
        </label>{" "}
        <br />
        <textarea
          id="caption"
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />{" "}
        <br />
        <button className="mt-3" onClick={submitHandler}>
          Post
        </button>
      </form>
    </div>
  );
}

export default AddPost;
