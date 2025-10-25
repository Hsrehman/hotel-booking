// TassPro API Types
export interface TassProDestinationInfo {
  destinationId: string;
  cityName: string;
  countryName: string;
  stateCode?: string;
  countryCode: string;
}

export interface TassProHotelInfo {
  systemId: string;
  name: string;
  address: {
    line1: string;
    line2: string;
    countryCode: string;
    countryName: string;
    cityName: string;
    stateCode?: string;
    zipCode: string;
  };
  geocode: {
    lat: number;
    lon: number;
  };
  rating: number;
  tripAdvisorRating: number;
  tripAdvisorUrl?: string;
  contact: {
    phoneNo: string;
    faxNo?: string;
    website?: string;
  };
  currencyCode?: string;
  imageUrl: string;
  imageUrls: string[];
  attractions?: any[];
  checkIn?: string;
  checkOut?: string;
  masterHotelAmenities: string[];
  masterRoomAmenities: string[];
}

export interface TassProSearchRequest {
  SearchParameter: {
    DestinationCode?: string;
    HotelCode?: string;
    CountryCode: string;
    Nationality: string;
    Currency: string;
    CheckInDate: string;
    CheckOutDate: string;
    Rooms: {
      Room: Array<{
        RoomIdentifier: number;
        Adult: number;
        Children?: {
          Count: number;
          ChildAge: Array<{
            Identifier: number;
            Text: string;
          }>;
        };
      }>;
    };
    TassProInfo?: {
      CustomerCode: string;
      RegionID: string;
    };
  };
}

export interface TassProSearchResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  ErrorInfo?: any;
  Monetary: {
    Currency: {
      Code: string;
      ExchangeRate: number;
      Text: string;
    };
  };
  Hotels: {
    Hotel: Array<{
      Code: string;
      Name: string;
      GroupCode: number;
      SupplierGroupCode: number;
      SupplierShortCode: string;
      MinPrice: number;
      SupplierMinPrice: number;
      SupplierCurrency: string;
      HotelInfo: {
        Image: string;
        Description: string;
        StarRating: string;
        Lat: string;
        Long: string;
        Add1: string;
        Add2: string;
        City: string;
        Location: string;
      };
    }>;
  };
}

export interface TassProRoomDetailRequest {
  SessionId: string;
  SearchParameter: {
    HotelCode: string;
    Currency: string;
    Rooms: {
      Room: Array<{
        RoomIdentifier: number;
        Adult: number;
        Children?: {
          Count: number;
          ChildAge: Array<{
            Identifier: number;
            Text: string;
          }>;
        };
      }>;
    };
  };
}

export interface TassProRoomDetailResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  ErrorInfo?: any;
  Monetary: {
    Currency: {
      Code: string;
      ExchangeRate: number;
      Text: string;
    };
  };
  Hotel: {
    HotelInfo: {
      Name: string;
      Image: string;
      Description: string;
      StarRating: string;
      Lat: string;
      Lon: string;
      Add1: string;
      Add2: string;
      City: string;
      Location: string;
    };
    Rooms: {
      Room: Array<{
        RoomIndex: number;
        RoomIdentifier: number;
        GroupCode: number;
        SupplierGroupCode: number;
        ShortCode: string;
        ContractType: string;
        RoomCombinationId: number;
        MarriageIdentifier: number;
        Reprice: string;
        IsPriceBreakupAvailable: boolean;
        IsCancelationPolicyAvailble: boolean;
        ExtraBedCount: number;
        Adult: number;
        Children?: {
          Count: number;
          ChildAge: Array<{
            Identifier: number;
            Text: string;
          }>;
        };
        RoomName: string;
        Meal: string;
        RateType: string;
        RateKey: string;
        Status: string;
        Price: {
          Gross: number;
          Tax: number;
          Net: number;
          TaxType: string;
          Commission: number;
          IsPackage: boolean;
          IsDynamic: boolean;
          IsExclusiveRate: boolean;
          SupplierCurrency: string;
          SupplierGross: number;
          SupplierTax: number;
          SupplierNet: number;
          SupplierCommission: number;
          ExtraBedPrice: number;
          SupplierExtraBedPrice: number;
        };
      }>;
    };
    Code: string;
    Name: string;
  };
}

export interface TassProBookingRequest {
  SessionId: string;
  DestinationCode: string;
  HotelCode: string;
  GroupCode: number;
  Currency: string;
  Nationality: string;
  CustomerRefNumber: string;
  Rooms: {
    Room: Array<{
      RoomIdentifier: number;
      Adult: number;
      Children?: {
        Count: number;
        ChildAge: Array<{
          Identifier: number;
          Text: string;
        }>;
      };
      RateKey: string;
      Guests: {
        Guest: Array<{
          Title: {
            Code: string;
            Text: string;
          };
          FirstName: string;
          LastName: string;
          IsLeadPAX: boolean;
          Type: string;
          Age: number;
        }>;
      };
      Price: {
        Gross: number;
        Net: number;
        Tax: number;
      };
    }>;
  };
}

export interface TassProBookingResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  ErrorInfo?: any;
  HotelCode: string;
  SupplierHotelCode: string;
  DestinationCode: string;
  CountryCode: string;
  SupplierGroupCode: string;
  Currency: string;
  Nationality: string;
  CustomerRefNumber: string;
  BookingCreation: string;
  HotelConfirmationNumber: string;
  ADSConfirmationNumber: string;
  SupplierConfirmationNumber: string;
  Status: string;
  Rooms: Array<{
    RoomIndex: number;
    RateKey: string;
    Status: string;
    RoomIdentifier: number;
    GroupCode: number;
    SupplierGroupCode: number;
    ShortCode: string;
    ContractType: string;
    RoomCombinationId: number;
    MarriageIdentifier: number;
    Reprice: string;
    IsPriceBreakupAvailable: boolean;
    IsCancelationPolicyAvailble: boolean;
    IsCache: boolean;
    MinStay?: number;
    ExtraBedCount: number;
    Adult: number;
    Children?: {
      ChildAge: Array<{
        Identifier: number;
        Text: string;
      }>;
      Count: number;
    };
  }>;
}

// Application Types
export interface SearchParams {
  destinationCode: string;
  countryCode: string;
  nationality: string;
  currency: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomConfig[];
}

export interface RoomConfig {
  roomIdentifier: number;
  adults: number;
  children: Array<{
    identifier: number;
    age: number;
  }>;
}

export interface HotelSearchResult {
  code: string;
  name: string;
  groupCode: number;
  supplierGroupCode: number;
  supplierShortCode: string;
  minPrice: number;
  supplierMinPrice: number;
  supplierCurrency: string;
  hotelInfo: {
    image: string;
    description: string;
    starRating: string;
    lat: string;
    lon: string;
    address1: string;
    address2: string;
    city: string;
    location: string;
  };
}

export interface RoomOption {
  roomIndex: number;
  roomIdentifier: number;
  groupCode: number;
  supplierGroupCode: number;
  shortCode: string;
  contractType: string;
  roomCombinationId: number;
  marriageIdentifier: number;
  reprice: string;
  isPriceBreakupAvailable: boolean;
  isCancelationPolicyAvailble: boolean;
  extraBedCount: number;
  adult: number;
  children?: {
    count: number;
    childAge: Array<{
      identifier: number;
      text: string;
    }>;
  };
  roomName: string;
  meal: string;
  rateType: string;
  rateKey: string;
  status: string;
  price: {
    gross: number;
    tax: number;
    net: number;
    taxType: string;
    commission: number;
    isPackage: boolean;
    isDynamic: boolean;
    isExclusiveRate: boolean;
    supplierCurrency: string;
    supplierGross: number;
    supplierTax: number;
    supplierNet: number;
    supplierCommission: number;
    extraBedPrice: number;
    supplierExtraBedPrice: number;
  };
}

export interface BookingDetails {
  sessionId: string;
  destinationCode: string;
  hotelCode: string;
  groupCode: number;
  currency: string;
  nationality: string;
  customerRefNumber: string;
  rooms: Array<{
    roomIdentifier: number;
    adults: number;
    children?: Array<{
      identifier: number;
      age: number;
    }>;
    rateKey: string;
    guests: Array<{
      title: string;
      firstName: string;
      lastName: string;
      isLeadPAX: boolean;
      type: string;
      age: number;
    }>;
    price: {
      gross: number;
      net: number;
      tax: number;
    };
  }>;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId?: string;
  guestEmail?: string;
  sessionId: string;
  adsConfirmationNumber?: string;
  hotelConfirmationNumber?: string;
  supplierConfirmationNumber?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  currency: string;
  destinationCode: string;
  hotelCode: string;
  countryCode: string;
  nationality: string;
  customerRefNumber: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
