// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import { connectToDB } from "@/lib/mongoDB";


// export const POST = async (req: NextRequest, res: NextResponse) => {
//     try {
//       await connectToDB();
  
//       const body = await req.json();
//       const { amount } = body;
  
//       if (!amount) {
//         return NextResponse.json({ message: 'Please enter amount' }, { status: 400 });
//       }
  
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: Number(amount) * 100, // Convert to cents
//         currency: 'usd',
//       });
  
//       return NextResponse.json(
//         {
//           success: true,
//           clientSecret: paymentIntent.client_secret,
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       console.error('Create_Payment_Intent_Error:', error);
  
//       return NextResponse.json(
//         {
//           message: 'Internal Server Error',
//           error: error instanceof Error ? error.message : 'Unknown error',
//         },
//         { status: 500 }
//       );
//     }
//   }