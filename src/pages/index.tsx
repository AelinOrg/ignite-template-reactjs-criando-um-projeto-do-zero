import { format } from 'date-fns';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import ptBR from 'date-fns/locale/pt-BR';
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

export default function Home(): JSX.Element {
  // TODO
  const fakePosts: Post[] = [
    {
      uid: '123',
      first_publication_date: '2021-12-22T02:17:19.364Z',
      data: {
        author: 'J.K. Rowling',
        title: 'Como utilizar Hooks',
        subtitle: 'Pensando em sincronização em vez de ciclos de vida.',
      },
    },
    {
      uid: '123',
      first_publication_date: '2021-12-22T02:17:19.364Z',
      data: {
        author: 'J.K. Rowling',
        title: 'Criando um app CRA do zero',
        subtitle:
          'Tudo sobre como criar a sua primeira aplicação utilizando Create React App.',
      },
    },
  ];

  return (
    <>
      <Head>
        <title>spacetraveling | Home</title>
      </Head>
      <main className={`${commonStyles.commonContainer} ${styles.container}`}>
        <div>
          {fakePosts.map(post => (
            <Link href="#nowhere" key={post.uid}>
              <a>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>

                <div>
                  <span>
                    <AiOutlineCalendar strokeWidth="50" size="20" />
                    {post.data.author}
                  </span>
                  <span>
                    <FiUser strokeWidth="3" size="20" />
                    {format(
                      new Date(post.first_publication_date),
                      'dd LLL yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
