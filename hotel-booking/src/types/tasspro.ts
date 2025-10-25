// TassPro API Types
export interface TassProApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  exceptionMessage?: string;
  errors?: any;
  data?: T;
}

// Destination Info Types
export interface DestinationInfoRequest {
  destination: string;
}

export interface DestinationInfoResponse {
  destinationId: string;
  cityName: string;
  countryName: string;
  stateCode?: string;
  countryCode: string;
}

// Hotels Info Types
export interface HotelsInfoByDestinationIdRequest {
  destinationId: string;
}

export interface HotelsInfoByDestinationIdResponse {
  destinationId: string;
  name: string;
  systemId: string;
  rating: number;
  city: string;
  address1: string;
  imageUrl: string;
  geoCode: {
    lat: number;
    lon: number;
  };
}

// Hotel Info Types
export interface HotelInfoRequest {
  hotelCode: string;
}

export interface HotelInfoResponse {
  systemId: string;
  name: string;
  address: {
    line1: string;
    line2: string;
    countryCode: string;
    countryName: string;
    cityName: string;
    stateCode: string;
    zipCode: string;
    cityCode?: string;
    stateName?: string;
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
  attractions?: any;
  checkIn?: any;
  checkOut?: any;
  masterHotelAmenities: string[];
  masterRoomAmenities: string[];
  giDestinationId: number;
}

// Country Info Types
export interface CountryInfoRequest {
  countryCode: string;
}

export interface CountryInfoResponse {
  key: string;
  value: string;
}

// Hotel Search Types
export interface HotelSearchRequest {
  SearchParameter: {
    HotelCode?: string;
    DestinationCode: string;
    CountryCode: string;
    CheckInDate: string;
    CheckOutDate: string;
    Currency: string;
    Nationality: string;
    Rooms: {
      Room: RoomConfiguration[];
    };
    TassProInfo?: {
      CustomerCode: string;
      RegionID: string;
    };
  };
}

export interface RoomConfiguration {
  RoomIdentifier: number;
  Adult: number;
  Children?: {
    Count: number;
    ChildAge: {
      Identifier: number;
      Text: string;
    }[];
  };
}

export interface HotelSearchResponse {
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
    Hotel: HotelSearchResult[];
  };
  Audit: {
    PropertyCount: number;
    Destination: string;
    ResponseTime: number;
  };
}

export interface HotelSearchResult {
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
}

// Room Details Types
export interface RoomDetailRequest {
  SessionId: string;
  SearchParameter: {
    HotelCode: string;
    Currency: string;
    Rooms: {
      Room: RoomConfiguration[];
    };
  };
}

export interface RoomDetailResponse {
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
      Room: RoomOption[];
    };
    Code: string;
    Name: string;
  };
}

export interface RoomOption {
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
    ChildAge: {
      Identifier: number;
      Text: string;
    }[];
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
}

// Price Breakup Types
export interface PriceBreakupRequest {
  SessionId: string;
  SearchParameter: {
    HotelCode: string;
    GroupCode: string;
    Currency: string;
    RateKeys: {
      RateKey: string[];
    };
  };
}

export interface PriceBreakupResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  HotelCode: string;
  GroupCode: number;
  SupplierGroupCode: number;
  ShortCode: string;
  CurrencyCode: string;
  PriceBreakdown: {
    RoomIdentifier: number;
    RateKey: string;
    Gross: number;
    Tax: number;
    NetAmount: number;
    Discount: number;
    SupplierGross: string;
    SupplierTax: number;
    SupplierNet: number;
    SupplierDiscount: number;
    RoomName: string;
    RateType: string;
    DateRange: {
      FromDate: string;
      ToDate: string;
    };
    SupplierText: string;
    Text: string;
    ExtraBedPrice: number;
    OtherCharges: number;
    ServiceCharge: number;
    ExtraGuestCharges: number;
    Commission: {
      Unit: string;
      Text: string;
      SupplierText: string;
      AppliedOn: string;
    };
    OtherFee: {
      FeeText: string;
      FeeValue: string;
      TaxType: string;
    };
    SupplierCurrency: string;
    SupplierExtrabed: number;
    SupplierOtherCharges: number;
    SupplierServiceCharge: number;
    SupplierExtraGuestCharges: number;
  }[];
}

// Cancellation Policy Types
export interface CancellationPolicyRequest {
  SessionId: string;
  SearchParameter: {
    HotelCode: string;
    GroupCode: string;
    Currency: string;
    RateKeys: {
      RateKey: string[];
    };
  };
}

export interface CancellationPolicyResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  Monetary: {
    Currency: {
      Code: string;
      ExchangeRate: number;
      Text: string;
    };
  };
  Rooms: {
    Room: {
      RoomIndex: number;
      RoomIdentifier: number;
      GroupCode: number;
      SupplierGroupCode: number;
      ShortCode: string;
      ContractType: string;
      RoomCombinationId: number;
      MarriageIdentifier: number;
      IsPriceBreakupAvailable: boolean;
      IsCancelationPolicyAvailble: boolean;
      ExtraBedCount: number;
      Adult: number;
      Children?: {
        Count: number;
        ChildAge: {
          Identifier: number;
          Text: string;
        }[];
      };
      RoomName: string;
      Meal: string;
      RateType: string;
      RateKey: string;
      Policies: {
        Policy: {
          Condition: {
            FromDate: string;
            ToDate: string;
            Timezone: string;
            Unit: number;
            Text: string;
            FromTime: string;
            ToTime: string;
            Percentage: string;
            Nights: string;
            Fixed: string;
            SupplierFixed: string;
            ApplicableOn: string;
            TextCondition: string;
            Type: string;
            Currency: string;
            SupplierCurrency: string;
          };
          Price: {
            Gross: number;
            Tax: number;
            Net: number;
            TaxType: string;
            Commission: number;
            IsB2C: boolean;
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
        }[];
      };
    }[];
  };
}

// PreBook Types
export interface PreBookRequest {
  SessionId: string;
  SearchParameter: {
    HotelCode: string;
    GroupCode: string;
    Currency: string;
    RateKeys: {
      RateKey: string[];
    };
  };
}

export interface PreBookResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  Monetary: {
    Currency: {
      Code: string;
      ExchangeRate: number;
      Text: string;
    };
  };
  IsSoldOut: boolean;
  IsPriceChanged: boolean;
  IsBookable: boolean;
  Hotel: {
    Code: string;
    Name: string;
    HotelInfo: {
      Name: string;
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
    Rooms: {
      Room: {
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
        IsCache: boolean;
        MinStay: number;
        ExtraBedCount: number;
        Adult: number;
        Children?: {
          Count: number;
          ChildAge: {
            Identifier: number;
            Text: string;
          }[];
        };
        RoomName: string;
        Meal: string;
        RateType: string;
        RateKey: string;
        Status: string;
        BedTypes: {
          BedType: string;
        };
        Policies: {
          Policy: {
            Condition: {
              FromDate: string;
              ToDate: string;
              Timezone: string;
              Unit: number;
              Text: string;
              FromTime: string;
              ToTime: string;
              Percentage: string;
              Nights: string;
              Fixed: string;
              SupplierFixed: string;
              ApplicableOn: string;
              TextCondition: string;
              Type: string;
              Currency: string;
              SupplierCurrency: string;
            };
          }[];
        };
        Promotions: {
          Code: string;
          Amount: number;
          SupplierAmount: number;
          Text: string;
        }[];
        PriceBreakdownRules: {
          PerNightInfo: {
            StartDate: string;
            EndDate: string;
            SupplierAmount: number;
            Amount: number;
          }[];
        };
        Remarks: {
          Remark: {
            Type: string;
            Text: string;
          }[];
        };
      }[];
    };
  };
}

// Booking Types
export interface BookingRequest {
  SessionId: string;
  DestinationCode: string;
  HotelCode: string;
  GroupCode: string;
  Currency: string;
  Nationality: string;
  CustomerRefNumber: string;
  Rooms: {
    Room: {
      RoomIdentifier: string;
      RateKeys: {
        RateKey: string;
      };
      Guests: {
        Guest: {
          IsLeadPAX: boolean;
          Type: string;
          Title: {
            Code: string;
            Text: string;
          };
          FirstName: string;
          LastName: string;
          Age: number;
        }[];
      };
      Price: {
        Gross: number;
        Net: number;
        Tax: number;
      };
    }[];
  };
}

export interface BookingResponse {
  ErrorInfo?: any;
  GeneralInfo: {
    ApiKey: string;
    CustomerCode?: string;
    SessionId: string;
    TimeStamp: string;
  };
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
  Rooms: {
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
    MinStay: number;
    ExtraBedCount: number;
    Adult: number;
    Children?: {
      Count: number;
      ChildAge: {
        Identifier: number;
        Text: string;
      }[];
    };
  }[];
}

// Cancellation Types
export interface CancellationRequest {
  SessionId: string;
  Currency: string;
  ADSConfirmationNumber: string;
  CancelRooms: {
    CancelRoom: {
      RoomIdentifier: number;
    }[];
  };
}

export interface CancellationResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  Monetary: {
    Currency: {
      Code: string;
      ExchangeRate: number;
      Text: string;
    };
  };
  ADSConfirmationNumber: string;
  Status: string;
}

// Booking Details Types
export interface BookingDetailsRequest {
  SessionId: string;
  ADSConfirmationNumber: string;
}

export interface BookingDetailsResponse {
  GeneralInfo: {
    ApiKey: string;
    SessionId: string;
    TimeStamp: string;
  };
  BookingDetails: any; // This would need to be defined based on actual API response
}

// Application Types
export interface SearchParams {
  destination: string;
  destinationId?: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomConfiguration[];
  nationality: string;
  currency: string;
}

export interface BookingFormData {
  email: string;
  phone: string;
  guests: {
    [roomId: string]: {
      leadGuest: {
        title: string;
        firstName: string;
        lastName: string;
        age: number;
      };
      additionalGuests: {
        title: string;
        firstName: string;
        lastName: string;
        age: number;
        type: 'Adult' | 'Child';
      }[];
    };
  };
  specialRequests?: string;
}

export interface PriceOverride {
  id: string;
  hotelCode: string;
  overrideType: 'PERCENTAGE' | 'FIXED';
  value: number;
  currency?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalMarkup {
  id: string;
  percentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
