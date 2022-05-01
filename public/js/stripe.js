import axios from 'axios';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51KGH6hJqNiS0Gthfv7kbDh7kzPR7jIKFMSlP9E8WtdcJcbiO4lWSQCBDr9oYeJXV6J7yKnhfV1FhUtTE70lZ5AdW00CRJPMdvj'
    );
    // 1. Lấy checkout session từ server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2. Tạo form thanh toán từ session đó
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    alert('error', err);
  }
};
