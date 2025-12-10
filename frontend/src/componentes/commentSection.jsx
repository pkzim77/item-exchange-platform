import { useState } from 'react';
import { Send, ThumbsUp, MoreVertical } from 'lucide-react';
/*import "../css/commentSection.css";*/
import { Avatar, AvatarFallback } from './avatar';

export function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'pKzim77',
      avatar: 'P',
      text: 'teste',
      timestamp: '2 horas atrás',
      likes: 0,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAddComment = () => {
    if (newComment.trim()) {
      const Comment = {
        id: Date.now().toString(),
        author: 'Você',
        avatar: 'Y',
        text: newComment,
        timestamp: 'agora',
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId) => {
    if (replyText.trim()) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: Date.now().toString(),
                author: 'Você',
                avatar: 'Y',
                text: replyText,
                timestamp: 'agora',
                likes: 0
              }
            ]
          };
        }
        return comment;
      }));
      setReplyText('');
      setReplyingTo(null);
    }
  };

   

  return (
    <div >
     

 
    </div>
  );
}
