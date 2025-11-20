import React from "react";

export default function CancellationPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refund Policy</h1>
      <p className="mb-4">
        At <strong>Ag’s Healthy Foods</strong>, we aim to provide high-quality products and a smooth
        shopping experience. Please read our cancellation and refund policy carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Order Cancellation</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Cancellations are accepted within <strong>24 hours</strong> of placing the order.</li>
        <li>Orders cannot be cancelled if they are already packed, shipped, or out for delivery.</li>
        <li>You may reject the product at the doorstep if it is already out for delivery.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Perishable Items</h2>
      <p className="mb-4">
        We do not accept cancellations for perishable items such as fresh foods and eatables.
        Refund or replacement is allowed only if the delivered product is spoiled or of poor quality.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Damaged or Defective Products</h2>
      <p className="mb-4">
        If you receive a damaged or defective product, report it within <strong>48 hours</strong> of delivery.
        A replacement or refund will be processed after verification.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Product Not as Expected</h2>
      <p className="mb-4">
        If the product does not match your expectations, contact customer support within
        <strong> 48 hours</strong>. Our team will review and decide the appropriate action.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Warranty Issues</h2>
      <p className="mb-4">
        For items with a manufacturer's warranty, please contact the manufacturer directly
        for service or replacement.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Refund Processing</h2>
      <p className="mb-4">
        Approved refunds will be processed within <strong>7–10 business days</strong> to the original
        payment method.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Details</h2>
      <p>
        <strong>Ag’s Healthy Foods Customer Support</strong><br />
        440 Mahalakshmi Nagar South,<br />
        Palpannaicherry, Nagapattinam – 611001
      </p>
    </div>
  );
}
