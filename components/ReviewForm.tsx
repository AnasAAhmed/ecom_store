import { FormEvent, useState } from "react";
import { FaEdit, FaSpinner } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import type { UserResource } from '@clerk/types';
import toast from "react-hot-toast";

type ReviewFormProps = {
    isEditing?: boolean;
    oldRating?: number;
    oldComment?: string;
    productId: string;
    user: UserResource | null;
};

const ReviewForm = ({ isEditing, productId, user, oldRating, oldComment }: ReviewFormProps) => {
    const [rating, setRating] = useState(oldRating || 0);
    const [comment, setComment] = useState(oldComment || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreatingReview, setIsCreatingReview] = useState(false);

    if (!user) {
        return null; // Ensure user is available
    }

    const handleCreateReview = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreatingReview(true);
        const reviewData ={
            rating,
            photo: user.imageUrl,
            comment,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName,
            userId: user.id,
        }
        try {
            const res = await fetch(`/api/products/reviews?productId=${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });
         

            const data = await res.json();

            if (res.ok) {
                location.reload();
                toast.success('Review submitted successfully');
                setModalOpen(false);
            } else {
                toast.error(data.message || 'Error submitting review');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            toast.error(`Error submitting review ${error}`);
        } finally {
            setIsCreatingReview(false);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div>
            <div className='flex flex-col items-center'>
                {isEditing ? (
                    <button className="text-[0.7rem] sm:text-sm px-1 py-1 rounded-md" onClick={openModal}>
                        <FaEdit />
                    </button>
                ) : (
                    <button onClick={openModal} className="bg-blue-500 text-white px-2 py-1 rounded-full mb-1">
                        Submit Review
                    </button>
                )}
            </div>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50" onClick={handleBackdropClick}>
                    <div className="bg-white w-full animate-modal p-8 rounded-md max-w-md">
                        <div className="flex flex-row justify-between mb-6 items-center">
                            <h2 className="text-xl font-semibold">Submit Review</h2>
                            <button onClick={closeModal} className="text-2xl rounded-md">
                                <IoCloseSharp />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleCreateReview}>
                            <div>
                                <label htmlFor="rating" className="block text-md mb-3 font-medium">Rating</label>
                                <input
                                    id="rating"
                                    type="number"
                                    max={5}
                                    className="border px-1 rounded-md w-full"
                                    placeholder="Rating"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-md mb-3 font-medium">Comment</label>
                                <textarea
                                    id="comment"
                                    rows={3}
                                    className="border px-1 rounded-md w-full"
                                    placeholder="Comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={isCreatingReview}>
                                {isCreatingReview ? <FaSpinner className='animate-spin text-heading3-bold mx-3' /> : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;
