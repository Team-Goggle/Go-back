import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function ViewSgf() {
  const router = useRouter();
  const { id } = router.query;
  const [sgf, setSgf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSgf = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/sgf/${id}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setSgf(data.data);
        } else {
          setError(data.message || '파일을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        setError('에러 발생: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSgf();
  }, [id]);

  return (
    <div>
      <Head>
        <title>{sgf ? `${sgf.title} - SGF 뷰어` : 'SGF 뷰어'}</title>
      </Head>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/">← 목록으로 돌아가기</Link>
        
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : sgf ? (
          <div>
            <h1>{sgf.title}</h1>
            <p>업로드 날짜: {new Date(sgf.uploadedAt).toLocaleString()}</p>
            <h2>SGF 내용:</h2>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '5px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: '500px',
              overflow: 'auto'
            }}>
              {sgf.content}
            </pre>
          </div>
        ) : (
          <p>데이터를 찾을 수 없습니다.</p>
        )}
      </main>
    </div>
  );
}