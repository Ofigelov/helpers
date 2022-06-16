type FSResponseStatuses = 'fail' | 'success';

type FSErrorCodes =
    | 'error_validation'
    | 'access_token_malformed'
    | 'bad_credentials'
    | 'password_incorrect'
    | 'bad_request'
    | 'access_token_error_decode'
    | 'email_same';

export interface IFSBaseResponse {
    status: FSResponseStatuses;
    metadata: {
        createdAt: string;
    };
}

export interface IFSSuccessResponse<T> extends IFSBaseResponse {
    status: 'success';
    data: T;
}

export interface FSErrorResponse extends IFSBaseResponse {
    status: 'fail';
    error: {
        code: FSErrorCodes;
        domain: string;
    };
    message: string;
}

export interface IFanscoreProfile {
    address1: string | null;
    address2: string | null;
    biography: string | null;
    birthDate: string | null;
    contactNumber: string | null;
    country: string | null;
    email: string | null;
    firstName: string | null;
    gender: string | null;
    id: number;
    language: string | null;
    lastName: string | null;
    lastUpdated: string | null;
    otherNames: string | null;
    postcode: string | null;
    profilePicture: string | null;
    profilePictureApproved: boolean;
    region: string | null;
    screenName: string | null;
    screenNameApproved: boolean;
    town: string | null;
}

interface FSPreferensesBody {
    name: string;
    client: string;
    key: string;
    privacyPolicy: string;
    text: string;
    preferences: {
        email: boolean;
        sms: boolean;
        post: boolean;
        phone: boolean;
        lastUpdated: string;
        set: boolean;
    };
}

type MembershipType =
    | 'GOLD MEMBERSHIP'
    | 'SEASON TICKET HOLDER'
    | 'JUNIOR GOLD MEMBERSHIP'
    | 'JUNIOR MEMBERSHIP'
    | 'INTERNATIONAL MEMBERSHIP'
    | 'SILVER MEMBERSHIP';

export interface IMemberShip {
    memberId: string;
    cardNumber: string;
    seatNumber: null | string;
    seatRow: null | string;
    blockReference: null | string;
    areaName: null | string;
    entranceGate: null | string;
    barcode: null | string;
    membershipName: MembershipType;
    membershipYear: number;
    season: boolean;
    loyaltyPoints?: number;
}

export type IProfileEntitlements = IDigitalMemberShip;

export interface IDigitalMemberShip {
    id: string;
    clientId: string;
    userId: number;
    entitlementId: string;
    entitlementName: string;
    startDate: string;
    endDate: null;
    active: boolean;
}

export interface GoldMemberShip extends IMemberShip {
    membershipName: 'GOLD MEMBERSHIP';
    seatNumber: null;
    seatRow: null;
    blockReference: null;
    areaName: null;
}

export interface SeasonMembership extends IMemberShip {
    membershipName: 'SEASON TICKET HOLDER';
    seatNumber: string;
    seatRow: string;
    blockReference: string;
    areaName: string;
}

interface ReferenceInfo {
    email: string;
    sourceSystemUserId: string;
    sourceSystemId: string;
    alias: string;
    id: number;
}

interface IFSClientPreference {
    clientId: string;
    description: string;
    key: string;
    name: string;
    options: IFSPreferenceOption[];
}

interface IFSPreferenceOption {
    id: number;
    selected: boolean;
    value: string;
}

interface ISeatGeekParams {
    code: string;
    state: string;
}

interface IStreamAmgEntitlementsLocation {
    Name: string | null;
    Country: string | null;
    CountryCode: string | null;
    State: string | null;
    City: string | null;
}

interface IStreamAmgEntitlements {
    UtcNow: number;
    LocationFromIp: IStreamAmgEntitlementsLocation;
    CurrentCustomerSessionStatus: number;
    ModelErrors: any;
    CurrentCustomerSession: {
        Id: string;
        CustomerId: string;
        CustomerEmailAddress: string | null;
        CustomerFirstName: string | null;
        CustomerLastName: string | null;
        CustomerBillingProfileCreatedAt: string;
        CustomerBillingProfileExpiresAt: string;
        CustomerBillingProfileLastFailedAt: string | null;
        CustomerBillingProfileProvider: string | null;
        CustomerBillingProfileReference: string | null;
        CustomerDeleted: boolean;
        CustomerEntitlements: string | null;
        CustomerPackages: string;
        CustomerFullAccessUntil: null;
        CustomerNonExpiringSubscriptionCount: number;
        CustomerSubscriptionCount: number;
        RequiresCardAuthenticationCount: number;
        Expiry: any;
    } | null;
}

export type IFSAuthorizeResponse = IFSSuccessResponse<ISeatGeekParams>;

export type IFSClientPreferencesResponse = IFSSuccessResponse<IFSClientPreference[]>;

export type IFSReferenceNumberResponse = IFSSuccessResponse<ReferenceInfo[]>;

export type IFSPreferencesResponse = IFSSuccessResponse<FSPreferensesBody | FSPreferensesBody[]>;

export type IFanscoreProfileResponse = IFSSuccessResponse<IFanscoreProfile>;

export type IFSMembershipResponse = IFSSuccessResponse<IMemberShip[]>;

export type IFSDigitalMembershipResponse = IFSSuccessResponse<IDigitalMemberShip[]>;

export type IStreamAmgPaymentsResponse = IStreamAmgEntitlements;

export interface FSLoginOrRegisterResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    jti: string;
}
