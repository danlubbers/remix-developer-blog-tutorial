import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

// import type { Post } from "~/models/post.server";
import { getPost } from "~/models/post.server";

type LoaderData = { title: string; html: string };

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, `slug is require`);
  const post = await getPost(slug);

  invariant(post, `Post not found: ${slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ title: post.title, html });
};

export default function PostSlug() {
  const { title, html } = useLoaderData() as LoaderData;
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
