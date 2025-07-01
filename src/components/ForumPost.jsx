import React from "react";

export default function ForumPost({
  entry,
  index,
  setEnlargedPhoto,
  setShowModal2,
  isAdmin,
  onDeletePost,
  onDeleteComment,
}) {
  return (
    <div className="forum-entry mb-4" key={entry.id || index}>
      <div className="d-flex justify-content-between">
        <span>
          <strong>{entry.author?.username || "Anonymous"}</strong>
        </span>
        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
        {isAdmin && (
          <button
            type="button"
            className="text-danger fw-bold fs-2 text-decoration-none ms-2"
            style={{ background: "none", border: "none" }}
            onClick={onDeletePost}
            title="Delete Post"
          >
            &minus;
          </button>
        )}
      </div>

      <div className="d-flex">
        <div className="row w-100">
          <div className="col-md-4">
            <div className="forum-content-box">
              {entry.photo && (
                <img
                  src={`data:image/jpeg;base64,${entry.photo}`}
                  alt="Post"
                  className="w100"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  onClick={() => {
                    setEnlargedPhoto(`data:image/jpeg;base64,${entry.photo}`);
                  }}
                />
              )}
              <p>{entry.description}</p>
            </div>
          </div>

          <div
            className="col-md-8 d-flex flex-column justify-content-start"
            style={{ maxHeight: "180px", overflow: "auto" }}
          >
            <div className="d-flex align-items-center mb-2">
              <strong className="me-2">Comments</strong>
              {!isAdmin && (
                <button
                  type="button"
                  className="text-primary fs-2 text-decoration-none ms-auto"
                  style={{
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => {
                    setShowModal2(entry.id);
                  }}
                >
                  +
                </button>
              )}
            </div>
            {entry.comments?.length > 0 ? (
              entry.comments.map((comment) => (
                <>
                  <div key={comment.id} className="comment mb-2">
                    <small className="fw-bold">
                      {comment.username || "Anonymous"}
                    </small>
                    <small className="text-muted">
                      | {new Date(comment.timestamp).toLocaleString()}{" "}
                    </small>
                    <br />
                    {comment.content}
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="text-danger fw-bold fs-5 text-decoration-none ms-2"
                      style={{ background: "none", border: "none" }}
                      onClick={() => onDeleteComment(entry.id, comment.id)}
                      title="Delete Comment"
                    >
                      &minus; Delete Comment
                    </button>
                  )}
                </>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
