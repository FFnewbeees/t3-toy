import type { GetStaticProps, NextPage, } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PostView } from "~/components/PostView";
import { PageLayout } from "~/components/Layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data } = api.posts.getById.useQuery({ id });

  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};



export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No Id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage;