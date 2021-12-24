import { format } from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function formatPosts(posts: Post[]): Post[] {
  return posts.map(post => ({
    uid: post.uid,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author ?? 'Unknown',
    },
  }));
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): JSX.Element {
  // TODO
  const [posts, setPosts] = useState<Post[]>(formatPosts(results));
  const [nextPage, setNextPage] = useState<string | null>(next_page);

  async function getNextPost(): Promise<void> {
    const data: ApiSearchResponse = await fetch(nextPage).then(async response =>
      response.json()
    );

    setPosts([...posts, ...formatPosts(data.results)]);
    setNextPage(data.next_page);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={`${commonStyles.commonContainer} ${styles.container}`}>
        <div>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h2>{post.data.title}</h2>
                {post.data.subtitle && <p>{post.data.subtitle}</p>}

                <div className={commonStyles.postMeta}>
                  <div>
                    <span>
                      <AiOutlineCalendar strokeWidth="50" size="20" />
                      {post.first_publication_date}
                    </span>
                    <span>
                      <FiUser strokeWidth="3" size="20" />
                      {post.data.author}
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          ))}

          {nextPage && (
            <button onClick={getNextPost} type="button">
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  const posts: Post[] = postsResponse.results;

  // TODO
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60, // 1 minuto
  };
};
