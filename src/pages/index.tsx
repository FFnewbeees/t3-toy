import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage, } from "next";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]!);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    }
  });

  if (!user) return null;

  return (
    <div className=" flex gap-3 ">
      <Image className=" h-16 w-16 rounded-full " src={user.profileImageUrl} alt="profile image" width={56} height={56} />
      <input
        placeholder="Type some emojis!"
        className=" bg-transparent grow outline-none"
        value={input}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({
                content: input
              })
            }
          }
        }}
      />
      {input !== "" && !isPosting && <button onClick={() => mutate({ content: input })}>Post</button>}
      {isPosting &&
        <div className="flex justify-center items-center">
          <LoadingSpinner size={20} />
        </div>}
    </div>
  )
}
const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong ...</div>

  return (
    <div className=" flex flex-col">
      {data.map((fullPost) => <PostView {...fullPost} key={fullPost.post.id} />)}
    </div>
  )
}

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if BOTH aren't loaded, since user tends to load faster
  if (!userLoaded) return <div />


  return (
    <PageLayout>
      <div className="border-b border-slate-400 p-4">
        {!isSignedIn && <div className=" flex justify-center"><SignInButton /></div>}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>

  );
};

export default Home;
