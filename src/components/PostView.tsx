import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { RouterOutputs } from "~/utils/api";
import Link from "next/link";

type PostWithUser = RouterOutputs['posts']['getAll'][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="flex p-4 border-b border-slate-400 gap-3" key={post.id}>
      <Image src={author.profileImageUrl} alt="profile image" width={56} height={56} />
      <div className=" flex flex-col">
        <div className=" flex text-slate-300 font-bold">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username!}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{` · ${dayjs(post.createdAt).fromNow()}`} </span>
          </Link>
        </div>
        <span className=" text-2xl">{post.content}</span>
      </div>
    </div>)
}