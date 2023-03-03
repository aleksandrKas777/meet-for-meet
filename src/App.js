import './reset.css'
import './App.css';
import {useEffect, useState} from "react"
import {doc, getDoc} from "firebase/firestore"
import {db} from "./firebaseInit"
import {logDOM} from "@testing-library/react";

const getDocFirebase = async (db, uuid) => {
    const docRef = doc(db, 'events', uuid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        // doc.data() will be undefined in this case
        return null
    }
}
// http://localhost:3000/?search=093606d2-6ca3-4a6e-8ad0-ac1058aa6dbb

const getResultGoogleMaps = (response, status) => {
    console.log(response, status)
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


const getDistanceAndTime = async (coordsOrigin, coordsDestination, setTimeRoute) => {

    const result = await getDistanceFromLatLonInKm(coordsOrigin.coords.latitude, coordsOrigin.coords.longitude, coordsDestination.latitude, coordsDestination.longitude)
    // const time = result / 4
    // const hour = Math.floor(time)
    // const min = Math.round(time % 1 * 100)
    // return setTimeRoute(`${hour > 0 ? hour + 'h' : ''} ${min > 0 ? min + 'min' : ''}`)
    const km = Math.floor(result)
    const m = Math.round(result % 1 * 100)
    return setTimeRoute(`${km > 0 ? km + 'km' : ''} ${m > 0 ? m + 'm' : ''}`)
    // eslint-disable-next-line no-undef
    // const origin = new google.maps.LatLng(coordsOrigin.coords.latitude)
    // // eslint-disable-next-line no-undef
    // const destination = new google.maps.LatLng(coordsOrigin.coords.longitude)
    // // eslint-disable-next-line no-undef
    // const service = new google.maps.DistanceMatrixService();
    // await service.getDistanceMatrix(
    //     {
    //         origins: [origin],
    //         destinations: [destination],
    //         travelMode: 'WALKING',
    //         // transitOptions: TransitOptions,
    //         // drivingOptions: DrivingOptions,
    //         // unitSystem: UnitSystem,
    //         // avoidHighways: Boolean,
    //         // avoidTolls: Boolean,
    //     }, getResultGoogleMaps);

}


function App() {
    const [data, setData] = useState(null)
    const [timeRoute, setTimeRoute] = useState(null)
    const [isErrorPosition, setIsErrorPosition] = useState(false)

    const successPosition = (e) => getDistanceAndTime(e, {
        latitude: data?.latitude,
        longitude: data?.longitude
    }, setTimeRoute)
    const errorPosition = () => setIsErrorPosition(true)

    useEffect(() => {
        const uuid = window.location.search.split('=')[1]

        try {
            getDocFirebase(db, uuid).then(response => {
                setData(response)
            })
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }, [])

    useEffect(() => {
        if (!data) return

        const geo = navigator.geolocation
        if (!geo) {
            errorPosition()
            return
        }
        geo.getCurrentPosition(successPosition, errorPosition)

    }, [data])
    console.log(data)
    return (
        <div className="App">
            <h1>{data?.placeName || ''}</h1>
            <p className={'address'}>{data?.address || '-'}</p>
            <ul className={'time-rating'}>
                <li className={'first'} style={{paddingRight: '15px', borderRight: '1px solid #BBD7CB'}}>
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.76923 2.97248C7.61539 2.97248 8.29231 2.31193 8.29231 1.48624C8.29231 0.66055 7.61539 0 6.76923 0C5.92308 0 5.24615 0.66055 5.24615 1.48624C5.24615 2.31193 5.92308 2.97248 6.76923 2.97248ZM6.85385 8.09174H10.2569C10.6673 8.09174 11 7.75904 11 7.34862C11 6.93821 10.6673 6.6055 10.2569 6.6055H7.95385L6.26154 3.88073C6.00769 3.46789 5.5 3.13761 4.99231 3.13761C4.82308 3.13761 4.73846 3.13761 4.56923 3.22018L0 4.62385V8.15589C0 8.57648 0.340952 8.91743 0.761539 8.91743C1.18212 8.91743 1.52308 8.57648 1.52308 8.15589V5.86238L3.3 5.2844L0.24841 17.0428C0.122679 17.5273 0.488368 18 0.988885 18C1.30977 18 1.59655 17.7997 1.70708 17.4985L3.97692 11.3119L5.92308 13.8716V17.2385C5.92308 17.659 6.26403 18 6.68462 18C7.1052 18 7.44615 17.659 7.44615 17.2385V12.7156L5.33077 8.99997L5.92308 6.6055L6.85385 8.09174Z"
                            fill="#9B8978"/>
                    </svg>
                    <span>{timeRoute ? `~ ${timeRoute}` : ''}</span>
                </li>
                <li style={{marginLeft: '15px'}}>
                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.77642 0.446858C8.86857 0.262675 9.13142 0.262674 9.22358 0.446857L11.7923 5.58085L17.4994 6.41983C17.7043 6.44995 17.7858 6.70189 17.6374 6.84633L13.518 10.8552L14.4782 16.505C14.5128 16.7085 14.2998 16.8638 14.1166 16.7688L9 14.1148L3.88339 16.7688C3.70018 16.8638 3.48724 16.7085 3.52182 16.505L4.482 10.8552L0.36264 6.84633C0.214213 6.70189 0.295727 6.44995 0.500636 6.41983L6.20772 5.58085L8.77642 0.446858Z"
                            fill="#9B8978"/>
                    </svg>
                    <span>{data?.raiting}</span>
                </li>
            </ul>
            <section className={'section--main'}>
                <div className={'section--main--top'}>
                    <img src={data?.placeImage || null} alt={'slider'}/>
                    <div>
                        <h2>{data?.nameOfEvent || ''}</h2>
                        {data?.forAdultsOnly && <span className={'adult'}>18+</span>}
                        <p>
                            {/*<svg width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                            {/*     xmlns="http://www.w3.org/2000/svg">*/}
                            {/*    <path d="M8 2V5" stroke="#9B8978" strokeWidth="1.5" strokeMiterlimit="10"*/}
                            {/*          strokeLinecap="round" strokeLinejoin="round"/>*/}
                            {/*    <path d="M16 2V5" stroke="#9B8978" strokeWidth="1.5" strokeMiterlimit="10"*/}
                            {/*          strokeLinecap="round" strokeLinejoin="round"/>*/}
                            {/*    <path d="M3.5 9.09009H20.5" stroke="#9B8978" strokeWidth="1.5" strokeMiterlimit="10"*/}
                            {/*          strokeLinecap="round" strokeLinejoin="round"/>*/}
                            {/*    <path*/}
                            {/*        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"*/}
                            {/*        stroke="#9B8978" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"*/}
                            {/*        strokeLinejoin="round"/>*/}
                            {/*    <path d="M15.6947 13.7H15.7037" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*    <path d="M15.6947 16.7H15.7037" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*    <path d="M11.9955 13.7H12.0045" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*    <path d="M11.9955 16.7H12.0045" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*    <path d="M8.29431 13.7H8.30329" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*    <path d="M8.29431 16.7H8.30329" stroke="#9B8978" strokeWidth="2" strokeLinecap="round"*/}
                            {/*          strokeLinejoin="round"/>*/}
                            {/*</svg>*/}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                                    stroke="#9B8978" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.51001"
                                      stroke="#9B8978" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                            {`Start: ${new Date(data?.calendarStartDate).toLocaleDateString().slice(0, 5)} ${new Date(data?.calendarStartDate).toLocaleTimeString().slice(0, 5)}`}
                        </p>

                        <p>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                                    stroke="#9B8978" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.51001"
                                      stroke="#9B8978" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                            {`End: ${new Date(data?.calendarEndDate).toLocaleDateString().slice(0, 5)} ${new Date(data?.calendarStartDate).toLocaleTimeString().slice(0, 5)}`}
                        </p>

                    </div>
                </div>

                <h4 style={{marginBottom: '10px'}}>Meeting description:</h4>
                <p>{data?.description || '-'}</p>

                <h4 style={{marginBottom: '10px'}}>Number of participants:</h4>
                {/*<p>{data?.description || ''}</p>*/}
                <div className={'section--main--participant'}>
                    <p>{`LEFT ${data?.maxPersonCount - data?.participantsEmailList.length || '-'}`}</p>
                    <p>{`MAX ${data?.maxPersonCount || '-'}`}</p>
                </div>
            </section>

            <div className={'chat'}>
                <p>Chat</p>
                <p>Chat will be available to those who have paid admission to the event</p>
            </div>

            <a href={'https://play.google.com'} className={'btn-google'}>
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3983_77499)">
                        <path
                            d="M5.39062 11.5001C5.39062 10.3806 5.70458 9.33184 6.25002 8.43385V4.62476H2.37291C0.834109 6.58818 0 8.98107 0 11.5001C0 14.0192 0.834109 16.4121 2.37291 18.3755H6.25002V14.5664C5.70458 13.6684 5.39062 12.6197 5.39062 11.5001Z"
                            fill="#CCBAA8"/>
                        <path
                            d="M11.5 17.5024L8.80469 20.1504L11.5 22.7984C14.0641 22.7984 16.4997 21.9789 18.4982 20.4671V16.6621H14.6252C13.7031 17.1999 12.6312 17.5024 11.5 17.5024Z"
                            fill="#E1D1C1"/>
                        <path
                            d="M6.25016 14.5664L2.37305 18.3755C2.67771 18.7642 3.00945 19.1365 3.36843 19.4892C5.54049 21.6231 8.42838 22.7984 11.5001 22.7984V17.5023C9.27093 17.5023 7.31715 16.3231 6.25016 14.5664Z"
                            fill="#CCBAA8"/>
                        <path
                            d="M23 11.5002C23 10.8129 22.9367 10.1242 22.8117 9.45345L22.7106 8.91064H11.5V14.2067H16.9559C16.426 15.2421 15.6114 16.0869 14.6251 16.6622L18.4981 20.4672C18.8938 20.1679 19.2727 19.842 19.6317 19.4893C21.8038 17.3553 23 14.5181 23 11.5002Z"
                            fill="#E1D1C1"/>
                        <path
                            d="M15.82 7.25594L16.2964 7.72402L20.1082 3.97918L19.6318 3.5111C17.4597 1.37714 14.5718 0.201904 11.5 0.201904L8.80469 2.84993L11.5 5.49796C13.1318 5.49796 14.666 6.12227 15.82 7.25594Z"
                            fill="#9B8978"/>
                        <path
                            d="M11.4997 5.49796V0.201904C8.42794 0.201904 5.54005 1.37714 3.36794 3.51105C3.00897 3.86373 2.67722 4.236 2.37256 4.62477L6.24968 8.43387C7.31671 6.67721 9.27049 5.49796 11.4997 5.49796Z"
                            fill="#9B8978"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_3983_77499">
                            <rect width="23" height="22.5965" fill="white" transform="translate(0 0.201904)"/>
                        </clipPath>
                    </defs>
                </svg>
                <p>Join with Google Play</p>
            </a>
            <p className={'text-footer'}>Coming soon in the Apple store</p>

        </div>
    );
}

export default App;
