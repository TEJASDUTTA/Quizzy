import React from "react";
import { auth, db } from "../firebase";
import Firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PopupSignIn({ setError, loading, type }) {
  const history = useHistory();

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    var provider = new Firebase.auth.GoogleAuthProvider();

    auth
      .signInWithPopup(provider)
      .then(async function (result) {
        if (result.additionalUserInfo.profile.hd === "iiita.ac.in") {
          let details = {
            name: result.additionalUserInfo.profile.name,
            email: result.additionalUserInfo.profile.email,
            last_Visited: new Date().toLocaleString(),
          };

          localStorage.setItem("type", type);
          if (type === "Student") {
            await db
              .collection("Student")
              .doc(result.additionalUserInfo.profile.email)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  doc.ref.update(details);
                } else {
                  doc.ref.set(details);
                }
              });

            history.push("/studentDash");
          } else if (type === "Teacher") {
            history.push("/teacherDash");
          }
        } else {
          setError("Use Institute ID");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };
  return (
    <Button
      className="   rounded  btn-block "
      disabled={loading}
      style={{ backgroundColor: "#F1732B" }}
      onClick={handleGoogleLogin}
    >
      <FontAwesomeIcon icon={["fab", "google"]} />
    </Button>
  );
}
