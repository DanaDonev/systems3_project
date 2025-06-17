import { redirect } from "react-router-dom";

export async function protectedLoader() {
  const res = await fetch("http://88.200.63.148:5006/profile", {
    credentials: "include",
  });
  if (!res.ok) {
    return redirect("/signin");
  }
  return null;
}
