import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [sgfList, setSgfList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // SGF 목록 불러오기
  useEffect(() => {
    const fetchSgfs = async () => {
      try {
        const res = await fetch('/api/sgf/list');
        const data = await res.json();
        if (data.success) {
          setSgfList(data.data);
        }
      } catch (error) {
        console.error('Error fetching SGFs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSgfs();
  }, []);

  // SGF 파일 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일이름으로 제목 설정 (확장자 제외)
    setTitle(file.name.replace('.sgf', ''));

    // 파일 내용 읽기
    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
    };
    reader.readAsText(file);
  };

  // SGF 업로드
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage('제목과 SGF 내용이 필요합니다.');
      return;
    }
    
    setUploading(true);
    
    try {
      const res = await fetch('/api/sgf/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage('업로드 성공!');
        setTitle('');
        setContent('');
        
        // 목록 새로고침
        const listRes = await fetch('/api/sgf/list');
        const listData = await listRes.json();
        if (listData.success) {
          setSgfList(listData.data);
        }
      } else {
        setMessage(`업로드 실패: ${data.message}`);
      }
    } catch (error) {
      setMessage(`에러 발생: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>SGF Upload Test</title>
        <meta name="description" content="Simple SGF Viewer" />
      </Head>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>SGF 뷰어</h1>
        
        {/* 업로드 폼 */}
        <div style={{ marginBottom: '30px' }}>
          <h2>SGF 업로드</h2>
          {message && <p>{message}</p>}
          
          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '10px' }}>
              <label>
                제목: 
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ marginLeft: '10px', width: '300px' }}
                />
              </label>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label>
                SGF 파일: 
                <input 
                  type="file" 
                  accept=".sgf" 
                  onChange={handleFileChange}
                  style={{ marginLeft: '10px' }}
                />
              </label>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label>
                SGF 내용:
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', height: '100px', display: 'block', marginTop: '5px' }}
                />
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={uploading || !title || !content}
            >
              {uploading ? '업로드 중...' : '업로드'}
            </button>
          </form>
        </div>
        
        {/* SGF 목록 */}
        <div>
          <h2>SGF 목록</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : sgfList.length > 0 ? (
            <ul>
              {sgfList.map((sgf) => (
                <li key={sgf._id}>
                  <Link href={`/view/${sgf._id}`}>
                    {sgf.title}
                  </Link>
                  <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#666' }}>
                    ({new Date(sgf.uploadedAt).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>업로드된 SGF 파일이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}