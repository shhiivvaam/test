import { doc, collection, addDoc, DocumentReference, DocumentSnapshot, DocumentData} from 'firebase/firestore';
import {onSnapshot} from 'firebase/firestore';
import {Stripe} from '@stripe/stripe-js';

import getStripe from '../stripe/initialise-stripe';
import {db} from '../firebase/firebase';

export async function createMonthlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_MONTHLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => console.error('error', err));
}

export async function createMonthlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_MONTHLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => console.error('error', err));
}

export async function createYearlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_YEARLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}

export async function createYearlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_YEARLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}

//standard
export async function createStandardMonthlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_STANDARD_MONTHLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => console.error('error', err));
}

export async function createStandardMonthlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_STANDARD_MONTHLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => {
        console.error('error', err)
    });
}

export async function createStandardYearlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_STANDARD_YEARLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}

export async function createStandardYearlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_STANDARD_YEARLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}

//premium
export async function createPremiumMonthlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_PREMIUM_MONTHLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => console.error('error', err));
}

export async function createPremiumMonthlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_PREMIUM_MONTHLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    }).catch(err => console.error('error', err));
}

export async function createPremiumYearlyCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_PREMIUM_YEARLY_PRICE_ID,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}

export async function createPremiumYearlyINRCheckoutSession(uid: string) {

    //create a new checkout session in the subcollection inside this customers document
    const docRef = doc(db, "customers", uid);
    const collRef = collection(docRef, "checkout_sessions");
    addDoc(collRef, {
        price: process.env.REACT_APP_PREMIUM_YEARLY_PRICE_INR,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    }).then((docRef: DocumentReference) => {
        onSnapshot(docRef, async (snap: DocumentSnapshot<DocumentData | undefined>) => {
            const data = snap.data();
            if (data?.sessionId) {
                const stripe: Stripe | null = await getStripe();
                stripe?.redirectToCheckout({sessionId: data.sessionId});
            }
        })
    })
}