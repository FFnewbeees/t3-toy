import type { GetStaticProps, NextPage, } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({ username });

  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className=" bg-slate-700 h-36 relative">
          <Image
            className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black"
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className=" p-4 text-2xl font-bold">
          {`@${data.username ?? ""}`}
        </div>
        <div className="border-b border-slate-400 w-full"></div>
      </PageLayout>
    </>
  );
};

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { PageLayout } from "~/components/Layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("No Slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default ProfilePage;