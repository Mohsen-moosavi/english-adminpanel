import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getCommentTree } from '../redux/features/commentSlice';
import CommentBox from '../components/modules/CommentBox';

export default function CommentLoop() {

    const isInitialised = useRef(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {state} = useLocation();
  const { commentTree, isLoading } = useSelector(state => state.commentData)
    const { id } = useParams();

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            if (id && state?.courseId && state?.courseName) {
                dispatch(getCommentTree({ id, navigate }))
            } else {
                navigate("/comments")
            }
        }
    }, [])

    return (
        <div>
            <h3 className='page-title'>{`کامنت برای دوره  ${state?.courseName}`}</h3>
            {commentTree.map((comment , index)=> ( <CommentBox key={index} courseId={state?.courseId} mainCommentId={id} comment={comment}/>))}
        </div>
    )
}
