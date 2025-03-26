interface Props {
    feedback: Feedback;
}

function FeedbackCard({ feedback }: Props) {
    return (
        <>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{feedback.user.name}</h5>
                <small>{feedback.dateModified.toLocaleDateString()}</small>
                <p>Rating: {feedback.rating}</p>
                <p>{feedback.content}</p>
            </div>
        </>
    );
}

export default FeedbackCard;
