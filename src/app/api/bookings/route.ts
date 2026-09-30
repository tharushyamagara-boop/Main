import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Server-side Firebase initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB5AN9lSenHdYR2gxUGsVMMJZ2flQbFOxc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5758307495-584da.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5758307495-584da",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5758307495-584da.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "162880584628",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:162880584628:web:cf2ba65d6e2367c8e2d0e1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// RFC 5322 compliant regex for email validation
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      serviceType,
      locationUrl,
      appointmentDate,
      appointmentDateFormatted,
      preferredTime,
      referralSource,
      attribution,
      description,
      assignedMemberId,
      assignedMemberName,
      assignedMemberWebsite
    } = body;

    // Validate Customer Identity
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: "A valid customer name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || !RFC5322_EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid customer email address conforming to RFC 5322 is required." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "A valid contact phone number with country code is required." },
        { status: 400 }
      );
    }

    // Validate Service Selection
    if (!serviceType || typeof serviceType !== 'string') {
      return NextResponse.json(
        { error: "Please select a valid service offering." },
        { status: 400 }
      );
    }

    // Validate Location
    if (!locationUrl || typeof locationUrl !== 'string' || locationUrl.trim().length < 3) {
      return NextResponse.json(
        { error: "A valid location (Google Maps GPS coordinates or physical address) is required." },
        { status: 400 }
      );
    }

    // Validate Date & Time
    if (!appointmentDate || typeof appointmentDate !== 'string') {
      return NextResponse.json(
        { error: "A scheduled appointment date is required." },
        { status: 400 }
      );
    }

    const sanitizedData = {
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceType: serviceType.trim(),
      locationUrl: locationUrl.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentDateFormatted: appointmentDateFormatted || appointmentDate,
      preferredTime: preferredTime?.trim() || "Morning (8:00 AM - 12:00 PM)",
      referralSource: referralSource?.trim() || "Direct Website Visit",
      attribution: attribution && typeof attribution === 'object' ? {
        channel: String(attribution.channel || referralSource || "Direct Website Visit"),
        source: attribution.source ? String(attribution.source) : undefined,
        medium: attribution.medium ? String(attribution.medium) : undefined,
        campaign: attribution.campaign ? String(attribution.campaign) : undefined,
        term: attribution.term ? String(attribution.term) : undefined,
        content: attribution.content ? String(attribution.content) : undefined,
        referrerUrl: attribution.referrerUrl ? String(attribution.referrerUrl) : undefined,
        referrerHost: attribution.referrerHost ? String(attribution.referrerHost) : undefined,
        landingPage: attribution.landingPage ? String(attribution.landingPage) : undefined,
        device: attribution.device ? String(attribution.device) : undefined,
        browser: attribution.browser ? String(attribution.browser) : undefined,
        firstSeenAt: Number(attribution.firstSeenAt) || Date.now(),
        lastSeenAt: Number(attribution.lastSeenAt) || Date.now(),
        sessionCount: Number(attribution.sessionCount) || 1
      } : {
        channel: referralSource?.trim() || "Direct Website Visit",
        firstSeenAt: Date.now(),
        lastSeenAt: Date.now(),
        sessionCount: 1
      },
      description: description?.trim() || "",
      assignedMemberId: assignedMemberId?.trim() || "auto",
      assignedMemberName: assignedMemberName?.trim() || "ASSERWA Central Dispatch",
      assignedMemberWebsite: assignedMemberWebsite?.trim() || "https://asserwa.rw",
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Store in Firestore bookings collection
    let documentId = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const docRef = await addDoc(collection(db, "bookings"), sanitizedData);
      documentId = docRef.id;
    } catch (firestoreError: any) {
      console.error("Firestore insertion error:", firestoreError);
      return NextResponse.json(
        { error: "Failed to save booking to database. Please check permissions or try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking request successfully received and queued for dispatch.",
      booking: {
        id: documentId,
        ...sanitizedData
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error processing booking request: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const bookings: any[] = [];
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      bookings.push({
        id: docSnap.id,
        customerName: data.customerName || '',
        email: data.email || '',
        phone: data.phone || '',
        serviceType: data.serviceType || '',
        locationUrl: data.locationUrl || '',
        appointmentDate: data.appointmentDate || '',
        appointmentDateFormatted: data.appointmentDateFormatted || data.appointmentDate || '',
        preferredTime: data.preferredTime || '',
        referralSource: data.referralSource || '',
        attribution: data.attribution || null,
        description: data.description || '',
        status: data.status || 'pending',
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now()
      });
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bookings: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
