import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {

  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading ...</div>

  if (!data) return <div>Something went wrong ...</div>

  return (
    <>
      <Head>
        <title>Create T3 App by Victor with love to Ly</title>
        <meta name="description" content="Generated by Victor with love to Ly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full h-full md:max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && <div className=" flex justify-center"><SignInButton /></div>}
            {user.isSignedIn && <SignOutButton />}
          </div>
          <div className=" flex flex-col">
            {data?.map((post) => <div className=" p-8 border-b border-slate-400" key={post.id}>{post.content}</div>)}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
