￼
 
 
 
 
 
	
	

 
 
 
TassPro
Hotel Service API V2 Documentation
 
Global Innovations
Dubai, United Arab Emirates
P.O Box: 112664.
Tel: (971) 4 3795722
Fax: (971)4 3795723
 
http://www.giinfotech.ae

￼
￼
 
Document Summary
This document provides the complete guidance to developers in the integration of Hotel Service using the TassPro API. It gives guidelines for creating API requests of hotel service in TassPro acceptable format and explains how the output response will be to be utilized
after consuming the API.
 
 
 
 
Document Release Note
Document Reviewed By: Asad Siddiqui                                    Date: 05/12/2024
Document Approved By: Sharique Salim                                  Date: 09/12/2024
 
 
Document Revision History				
Version	Status	Update Comment	Modified By	Date
2.0	Completed	JSON Version	API Development Team	30/11/2024
1.0	Completed	Initial Version (XML)	API Development Team	27/06/2022
￼
￼
PREFACE
This Document provides a comprehensive description to consume and implement the TassPro API for Services starting from Search till Booking and Cancellation.
 
WHO SHOULD READ THIS DOCUMENT
 
·       Developer implementing/integrating this Hotel Service API.
·       Business Analyst (Travel Domain).
·       Travel/Reservation Consultant.
·       A Travel Manager.
 
CONTACTING CUSTOMER SUPPORT
If you need additional help, contact software support by calling over phone, sending email or a fax.
Technical Support number         :        +971 4 379 5722 Technical Support Email    :                                             support@giinfotech.ae

￼
￼
Table of Contents

PREFACE............................................................................................................. 3
WHO SHOULD READ THIS DOCUMENT............................................................. 3
CONTACTING CUSTOMER SUPPORT................................................................. 3
INTRODUCTION................................................................................................. 6
Hotel Static Content API Methods.................................................................... 7
DestinationInfo API.......................................................................................... 7
HotelsInfoByDestinationId API........................................................................ 8
HotelInfo API..................................................................................................... 9
CountryInfo API................................................................................................ 9
Process Flow.................................................................................................... 11
Hotel Service Distribution API Detail and Methods...................................... 12
Hotel Service API endpoints........................................................................... 12
Hotel Search Method....................................................................................... 12
Hotel Search Request...................................................................................... 13
Hotel Search Request Structure Details........................................................ 14
Hotel Search Response................................................................................... 15
Hotel Search Response Structure Details...................................................... 16
Hotel Room Detail Method.............................................................................. 17
Hotel Room Detail Request............................................................................. 17
Hotel Room Detail Request Structure Details............................................... 18
Hotel Room Detail Response.......................................................................... 19
Hotel Room Detail Response Structure Details............................................. 20
Hotel Price Breakup Method........................................................................... 22
￼
￼
Hotel Price Breakup Request.......................................................................... 22
Hotel Price Breakup Request Structure Details............................................ 22
Hotel Price Breakup Response....................................................................... 23
Hotel Price Breakup Response Structure Details.......................................... 24
Hotel Cancellation Policy Method................................................................... 25
Hotel Cancellation Policy Request................................................................. 25
Hotel Cancellation Policy Request Structure Detail...................................... 25
Hotel Cancellation Policy Response............................................................... 26
Hotel Cancellation Policy Response Structure Details................................. 27
PreBook Method.............................................................................................. 29
PreBook Request............................................................................................. 29
PreBook Request Structure Detail................................................................. 29
PreBook Response........................................................................................... 30
PreBook Response Structure Details............................................................. 31
Hotel Booking Method..................................................................................... 33
Hotel Booking Request................................................................................... 34
Hotel Booking Request Structure Details...................................................... 35
Hotel Booking Response................................................................................. 36
Hotel Booking Response Structure Details................................................... 37
Hotel Cancelation Method............................................................................... 38
Hotel Cancelation Request.............................................................................. 38
Hotel Cancelation Request Structure Details................................................ 39
Hotel Cancelation Response........................................................................... 39
Hotel Cancelation Response Structure Details.............................................. 40
￼
￼
Hotel Booking Details (Retrieve) Method...................................................... 40
Hotel Booking Details (Retrieve) Request.................................................... 40
Hotel Booking Details (Retrieve) Response.................................................. 41
Booking Status................................................................................................ 41

 
 
 
 
 
INTRODUCTION
This document describes TassPro Hotel Service Web Api, which can be integrated into various applications. It is intended specially for developers and also other team members get through this document to know how it works. This guide provides all the required information to integrate this Hotel Service API. We recommend you to read this full guide.
 
This guide explains the use of each method, what support we are providing to use the web API efficiently, how to access the resources provided by TassPro API. We are also providing some samples requests/response and the detail structure of the request and response entities to ease out the integration process.
 
Also this API integration contains the certification process you need to go through for live access. The document assumes that you are familiar with web API technology. Still if you face any issue or any concern you can reach us as support@giinfotech.ae.

￼
￼
Hotel Static Content API Methods
 
DestinationInfo API
Endpoint: http://uat-apiv2.giinfotech.ae/api/v2/hotel/destination-info Method Type: POST
Content-Type: application/json Format Type: json
Description: The DestinationInfo api is the post method which accepts destination name in the request and returns the destination related information in the response.
 
Note: In some cases the api returns more than one destination details in the response so it’s strongly recommended to take country code into consideration to get the exact destinationId.
Updates in DestinationInfo API v2
 
#. The api returns a newly added string field destinationId in the response which
contains the new destination’s id in a string format.
 
DestinationInfoRQ (json api request)
 
{
"destination": "MOSCOW"
}
DestinationInfoRS (json api response)
 
	
	


￼
￼
HotelsInfoByDestinationId API
Endpoint: http://uat-apiv2.giinfotech.ae/api/v2/hotel/HotelsInfoByDestinationId Method Type: POST
Content-Type: application/json Format Type: json
Description: The HotelsInfoByDestinationId api is the post method which accepts destination id returned in the DestinationInfo api method (destinationId) in the request and returns the list of hotels and their information in the response.
Updates in HotelsInfoByDestinationId API v2
#. Added new string field destinationId in HotelsInfoByDestinationIdRQ and HotelsInfoByDestinationIdRS.
#. The api returns a newly added string field destinationId in the response which contains
the new destination’s id in a string format.
 
HotelsInfoByDestinationIdRQ (json api request)
 
{
"destinationId": "160-0"
}
HotelsInfoByDestinationIdRS (json api response)
	
	


￼
￼
HotelInfo API
Endpoint: http://uat-apiv2.giinfotech.ae/api/v2/hotel/hotel-Info Method Type: POST
Content-Type: application/json Format Type: json
Description: The HotelInfo api is the post method which accepts hotel code returned in the HotelsInfoByDestinationId api method (systemId) in the request and returns the hotel related information in the response.
Note: In the HotelInfo api method both the fields hotelCode and systemId is equivalent. HotelInfoRQ (json api request)
{
"hotelCode": "4999"
}
 
HotelInfoRS (json api response)
 
	
	

 
 
CountryInfo API
Endpoint: http://uat-apiv2.giinfotech.ae/api/v2/hotel/country-info Method Type: POST
Content-Type: application/json Format Type: json

￼
 
￼
Description: The CountryInfo api is the post method which accepts 2 digit ISO country code and returns all the cities and destination id in key values pairs in the response.
 
Updates in CountryInfo API v2
#. The CountryInfo API returns all the cities with the mapped destination id in key value pairs in the response. Here key contains the destinationId whereas value contains the destination.
 
CountryInfoRQ (json api request)
 
{
"countryCode": "AE"
}
 
CountryInfoRS (json api response)
	
	


￼
￼
Process Flow
					
					
					
					
					

 
 
 
 
 
 
					
					
					
					
					

 
					
					
					
					
					


￼
￼
Hotel Service Distribution API Detail and Methods
 
Hotel Service API endpoints
·       Search: http://uat-apiv2.giinfotech.ae/api/v2/hotel/Search
·       Room Details: http://uat-apiv2.giinfotech.ae/api/v2/hotel/RoomDetails
·       Price Breakup: http://uat-apiv2.giinfotech.ae/api/v2/hotel/PriceBreakup
·       Cancellation Policy: http://uat-apiv2.giinfotech.ae/api/v2/hotel/CancellationPolicy
·       PreBook: http://uat-apiv2.giinfotech.ae/api/v2/hotel/PreBook
·       Booking: http://uat-apiv2.giinfotech.ae/api/v2/hotel/Book
 
·       Cancel: http://uat-apiv2.giinfotech.ae/api/v2/hotel/Cancel
·       Booking Details: http://uat-apiv2.giinfotech.ae/api/v2/hotel/BookingDetails
 
Test Credentials
API Key: VyBZUyOkbCSNvvDEMOV2==
Registered Currency: AED
 
Hotel Search Method
This method returns hotel availability along with the lowest pricing options. The request provides a single query that requires all mandatory parameters to initiate the search. The search can be done destination-wise by passing the destination code and getting all of the hotels, or by passing the Hotel Code along with the destination code as a parameter in the request to get the results for a specific property.
Once the provided search query has been parsed and validated, the API will start searching for the best option across all available sources.

￼
 
 
 
￼
Hotel Search Request
	
	


￼
 
 
￼
Hotel Search Request Structure Details
 
	Data Type		Description
SearchParameter		Mandatory	mandatory parameters needs to be sent to get hotel availability
			
			
HotelCode	string		internal mapped unique hotel code
DestinationCode	string	Mandatory	internal mapped destination’s unique code
CountryCode	string	Mandatory	two digits ISO standard country code (e.g.: AE, GB, US)
CheckinDate	date time	Mandatory	check-in date in YYYY-MM-dd format
(e.g.:2025-04-15)
CheckoutDate	date time	Mandatory	check-out date in YYYY-MM-dd format (e.g.:2025-04-18)
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
Nationality	string	Mandatory	two digits ISO standard country code (e.g.: AE, GB, US)
Rooms		Mandatory	list of rooms to be searched / booked
Room		Mandatory	room containing passenger details
(Note: maximum 6 rooms is allowed in a search
request)
Room Identifier	integer	Mandatory	room number/identifier
Adult	integer	Mandatory	total no. of adult passenger in the room
(Note: maximum 9 adults are allowed in a room)
Children			Children Array with Count
(Note: maximum 4 children are allowed in a room)
Count	integer		total no. of children in the room if applicable
Child Age	integer		child with Identifier and age
(Note: min age for child is 1 and max age 17 )
￼
	
	
￼
Hotel Search Response

￼
￼
Hotel Search Response Structure Details
 
	Data Type	Description
GeneralInfo		
ApiKey	string	unique id assigned to the customer
SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking process)
TimeStamp	date time	current date and time of the search
Audit		
PropertyCount	integer	total number of properties returned in the search response
Destination	string	searched destination country code and destination country name
ResponseTime	date time	time taken to return the total no. of properties in the search Response in seconds
Monetary		
Currency	string	exchange currency information
Code	string	currency code(ISO standard 3 digit currency code)
ExchangeRate	decimal	current exchange rate information based on USD
Text	string	currency code ISO standard 3 digit currency code)
Hotels		list of available properties based on the search criteria
Hotel		
Code	string	internal mapped unique hotel code
Name	string	hotel name
GroupCode	integer	internal group code
SupplierGroupCode	integer	internal supplier group code
SupplierShortCode	string	internal supplier name
MinPrice	decimal	minimum price of the room available in the hotel
SupplierMinPrice	decimal	supplier minimum price of the room available in the hotel
SupplierCurrency	string	internal supplier currency code
		
HotelInfo		hotel Information including room options
Image	string	Image url of the property
Description	string	brief description of the property
StarRating	string	star rating of the property
Lat	string	latitude of the property
Long	string	longitude of the property
Add1	string	address Line 1 of the property
Add2	string	address Line 2 of the property
City	string	city of the property
Location	string	location of the property
￼
￼
Hotel Room Detail Method
This method provides complete details on the hotel rooms based on the hotel selected. It contains room alternatives with complete information such as RoomName, RateType, MealType, Availability Status, Price Detail, and more.
 
Hotel Room Detail Request
	
	


￼
￼
Hotel Room Detail Request Structure Details
 
 
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
SearchParameter			
HotelCode	string		internal mapped unique hotel code
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
Rooms		Mandatory	list of rooms to be searched / booked
Room		Mandatory	room containing passenger details
(Note: maximum 6 rooms is allowed in a search request)
Room Identifier	integer	Mandatory	room number/identifier
Adult	integer	Mandatory	total no. of adult passenger in the room
(Note: maximum 9 adults are allowed in a room)
Children			children array with count
(Note: maximum 4 children are allowed in a room)
Count	integer		total no. of children in the room if applicable
Child Age	integer		child with Identifier and age
(Note: min age for child is 1 and max age 17 )
￼
￼
Hotel Room Detail Response
 
	
	



 
 
Hotel Room Detail Response Structure Details			
		Data Type	Description
	GeneralInfo		
	ApiKey	string	unique id assigned to the customer
	SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking process)
	TimeStamp	date time	current date and time of the search
	Audit		
	PropertyCount	integer	total number of properties returned in the search response
	Destination	string	searched destination country code and destination country name
	ResponseTime	date time	time taken to return the total no. of properties in the search Response in seconds
	Monetary		
	Currency	string	exchange currency information
	Code	string	currency code(ISO standard 3 digit currency code)
	ExchangeRate	decimal	current exchange rate information based on USD
	Text	string	currency code ISO standard 3 digit currency code)
	Hotels		list of available properties based on the search criteria
	Hotel		
	Code	string	internal mapped unique hotel code
	Name	string	hotel name
			
	HotelInfo		hotel Information including room options
	Image	string	Image url of the property
	Description	string	brief description of the property
	StarRating	string	star rating of the property
	Lat	string	latitude of the property
	Long	string	longitude of the property
	Add1	string	address Line 1 of the property
	Add2	string	address Line 2 of the property
	City	string	city of the property
	Location	string	location of the property
			
	Rooms		
	Room		
	RoomIndex	integer	room’s index value
	RoomIdentifier	integer	room’s serial number
	GroupCode	integer	internal group code
Page 20 of 41			
			
	SupplierGroupCode	integer	internal supplier group code
	ShortCode	string	internal supplier name
	ContractType	string	internal contract type value
	RoomCombinationId	integer	room’s combination identifier
	MarriageIdentifier	integer	room’s combination identifier
	Reprice	string	internal entity value
	IsPriceBreakup
Available	boolean	internal entity value
	IsCancelation Policy Availble	boolean	internal entity value
	ExtraBedCount	integer	only if applicable, no. of extra beds will be provided
	Adult	integer	total no. of adult passenger in the room
	Children		children array with count
(Note: maximum 4 children are allowed in a room)
	Count	integer	total no. of children in the room if applicable
	Child Age	integer	child with Identifier and age
(Note: min age for child is 1 and max age 17 )
	RoomName	string	name of the room
	Meal	string	meal type description, possible values “Room Only”, ”Bed and Breakfast” etc.
	RateType	string	rate type description (Refundable or Non Refundable)
	RateKey	string	a unique id/key associated with specific room
	Status	string	shows the availability, possible values are Available and Not Available
	Price		provides price related information
	Gross	decimal	total gross price per room
	Tax	decimal	total tax per room
	Net	decimal	total net price per room
	TaxType	string	tax type/ tax name
	Commission	decimal	total commission per room
	IsPackage	boolean	indicates if it’s a package rate or non-package Rate
	IsDynamic	boolean	indicates if it’s a dynamic rate or non-dynamic Rate
	IsExclusiveRate	boolean	indicates if it’s an exclusive rate or non-exclusive Rate
	SupplierCurrency	string	supplier currency code
	SupplierGross	decimal	total supplier gross price per room
	SupplierTax	decimal	total supplier tax per room
	SupplierNet	decimal	total supplier net price per room
	Supplier Commission	decimal	total supplier commission per room
	ExtraBedPrice	decimal	only if applicable extra bed price will be shown
	SupplierExtraBedPrice	decimal	only if applicable extra bed price will be shown
Page 21 of 41			
￼
 
￼
Hotel Price Breakup Method
The hotel pricing breakdown method provides information on the nightly charges or rates per room. The unique RateKey associated with specific room options, which is returned in the hotel room detail response, must be sent in the request.
 
Hotel Price Breakup Request
	
	

Hotel Price Breakup Request Structure Details
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
SearchParameter			
HotelCode	string		internal mapped unique hotel code
GroupCode	string	Mandatory	internal group code
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
RateKeys			
RateKey		Mandatory	a unique id/key associated with specific room
￼
￼
Hotel Price Breakup Response
 
	
	



Hotel Price Breakup Response Structure Details			
		Data Type	Description
	GeneralInfo		
	ApiKey	string	unique id assigned to the customer
	SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking
process)
	TimeStamp	date time	current date and time of the search
	Hotel Code	string	internal mapped unique hotel code
	GroupCode	integer	internal group code
	SupplierGroupCode	integer	internal group code
	ShortCode	integer	internal supplier group code
	CurrencyCode	string	three digits ISO standard currency code (e.g.: AED, GBP, USD)
	PriceBreakdown		
	RoomIdentifier	integer	room’s index value
	RateKey	string	a unique id/key associated with specific room
	Gross	decimal	total gross price per room
	Tax	decimal	total tax per room
	NetAmount	decimal	total net price per room
	Discount	decimal	total discount per room
	SupplierGross	string	total supplier gross price per room
	SupplierTax	decimal	total supplier tax per room
	SupplierNet	decimal	total supplier net price per room
	SupplierDiscount	decimal	total supplier discount per room
	RoomName	integer	name of the room
	RateType	string	rate type description (Refundable or Non Refundable)
	DateRange		
	FromDate	date time	start date
	ToDate	date time	to date
	SupplierText	string	supplier charges per night
	Text	string	charges per night
	ExtraBedPrice	decimal	only if applicable extra bed price will be shown
	OtherCharges	decimal	charges in customer currency, if applicable
	ServiceCharge	decimal	charges in customer currency, if applicable
	ExtraGuestCharges	decimal	charges in customer currency, if applicable
	Commission		
	Unit	string	no. of units, if applicable
	Text	string	amount in customer currency, if applicable
	SupplierText	string	amount in supplier currency, if applicable
	AppliedOn	string	free text, if applicable
Page 24 of 41			
￼
￼
 
OtherFee		
FeeText	string	Information of the any other charges, if applicable
FeeValue	string	amount of any other charges, if applicable
TaxType		type of the tax
		
SupplierCurrency	string	internal supplier currency code
SupplierExtrabed	decimal	charges in supplier currency, if applicable
SupplierOtherCharges	decimal	charges in supplier currency, if applicable
SupplierServiceCharge	decimal	charges in supplier currency, if applicable
SupplierExtraGuestCharges	decimal	charges in supplier currency, if applicable
 
Hotel Cancellation Policy Method
This method returns room-specific cancelation policies. It is required in the request to include the unique ratekey associated with certain room options, which is returned in the hotel room detail response.
Hotel Cancellation Policy Request
	
	

Hotel Cancellation Policy Request Structure Detail
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
SearchParameter			
HotelCode	string		internal mapped unique hotel code
GroupCode	string	Mandatory	internal group code
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
RateKeys			
RateKey		Mandatory	a unique id/key associated with specific room
￼
 
	
	
￼
Hotel Cancellation Policy Response


Hotel Cancellation Policy Response Structure Details			
		Data Type	Description
	GeneralInfo		
	ApiKey	string	unique id assigned to the customer
	SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking process)
	TimeStamp	date time	current date and time of the search
	Monetary		
	Currency	string	exchange currency information
	Code	string	currency code(ISO standard 3 digit currency code)
	ExchangeRate	decimal	current exchange rate information based on USD
	Text	string	currency code ISO standard 3 digit currency code)
	Rooms		
	Room		
	RoomIndex	integer	room’s index value
	RoomIdentifier	integer	room’s serial number
	GroupCode	integer	internal group code
	SupplierGroupCode	integer	internal supplier group code
	ShortCode	string	internal supplier name
	ContractType	string	internal contract type value
	RoomCombinationId	integer	room’s combination identifier
	MarriageIdentifier	integer	room’s combination identifier
	IsPriceBreakup Available	boolean	internal entity value
	IsCancelation Policy
Availble	boolean	internal entity value
	ExtraBedCount	integer	only if applicable, no. of extra beds will be provided
	Adult	integer	total no. of adult passenger in the room
	Children		children array with count
(Note: maximum 4 children are allowed in a room)
	Count	integer	total no. of children in the room if applicable
	Child Age	integer	child with Identifier and age
(Note: min age for child is 1 and max age 17 )
	RoomName	string	name of the room
	Meal	string	meal type description, possible values “Room Only”,
”Bed and Breakfast” etc.
	RateType	string	rate type description (Refundable or Non Refundable)
	RateKey	string	a unique id/key associated with specific room
	Policies		
	Policy		
Page 27 of 41			
			
	Condition		
	FromDate	date time	date from when charges will be applied
	ToDate	date time	date till when charges will be applied
	Timezone	string	applicable time zone based on destination
	Unit	integer	no. of units, if applicable
	Text	string	amount in customer currency, if applicable
	FromTime	string	time from when charges will be applied
	ToTime	string	time till when charges will be applied
	Percentage	string	cancellation charges in percentage
	Nights	string	cancellation charges in no of nights
	Fixed	string	cancellation charges in fixed amount
	SupplierFixed	string	supplier cancellation charges in fixed amount
	ApplicableOn	string	type of charges applicable
	TextCondition	string	free text/remarks
	Type	string	returns policy types
possible value are “CAN”= Cancellation Policy, “NOS”=No Show Policy,
“MOD”=Modified
	Currency	string	three digits ISO standard currency code (e.g.: AED, GBP, USD)
	SupplierCurrency	string	internal supplier currency code
			
	Price		provides price related information
	Gross	decimal	total gross price per room
	Tax	decimal	total tax per room
	Net	decimal	total net price per room
	TaxType	string	tax type/ tax name
	Commission	decimal	total commission per room
	IsB2C	boolean	indicates if it’s a b2b or b2c rate
	IsPackage	boolean	indicates if it’s a package rate or non-package Rate
	IsDynamic	boolean	indicates if it’s a dynamic rate or non-dynamic Rate
	IsExclusiveRate	boolean	indicates if it’s an exclusive rate or non-exclusive Rate
	SupplierCurrency	string	supplier currency code
	SupplierGross	decimal	total supplier gross price per room
	SupplierTax	decimal	total supplier tax per room
	SupplierNet	decimal	total supplier net price per room
	Supplier Commission	decimal	total supplier commission per room
	ExtraBedPrice	decimal	only if applicable extra bed price will be shown
	SupplierExtraBedPrice	decimal	only if applicable extra bed price will be shown
			
Page 28 of 41			
￼
￼
PreBook Method
The Hotel Price and Availability or Reprice method returns the current cancellation policies, rate type (Refundable or Non-Refundable), availability, whether the price has changed or not, and whether it is still bookable. It is mandatory to call this method before every booking.
In the request, the unique Ratekey associated to specific room options must be given, which is returned in the hotel room detail response.
 
PreBook Request
	
	

PreBook Request Structure Detail
 
 
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
SearchParameter			
HotelCode	string		internal mapped unique hotel code
GroupCode	string	Mandatory	internal group code
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
RateKeys			
RateKey		Mandatory	a unique id/key associated with specific room
￼
	
	
￼
PreBook Response


PreBook Response Structure Details			
		Data Type	Description
	GeneralInfo		
	ApiKey	string	unique id assigned to the customer
	SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking process)
	TimeStamp	date time	current date and time of the search
	Monetary		
	Currency	string	exchange currency information
	Code	string	currency code(ISO standard 3 digit currency code)
	ExchangeRate	decimal	current exchange rate information based on USD
	Text	string	currency code ISO standard 3 digit currency code)
	IsSoldOut	boolean	returns true if sold out
	IsPriceChanged	boolean	returns true if price is changed
	IsBookable	boolean	returns true if its bookable
	Hotel		
	Code	string	internal mapped unique hotel code
	Name	string	hotel name
			
	HotelInfo		hotel Information including room options
	Name	string	hotel name
	Image	string	Image url of the property
	Description	string	brief description of the property
	StarRating	string	star rating of the property
	Lat	string	latitude of the property
	Long	string	longitude of the property
	Add1	string	address Line 1 of the property
	Add2	string	address Line 2 of the property
	City	string	city of the property
	Location	string	location of the property
			
	Rooms		
	Room		
	RoomIndex	integer	room’s index value
	RoomIdentifier	integer	room’s serial number
	GroupCode	integer	internal group code
	SupplierGroupCode	integer	internal supplier group code
	ShortCode	string	internal supplier name
	ContractType	string	internal contract type value
	RoomCombinationId	integer	room’s combination identifier
	MarriageIdentifier	integer	room’s combination identifier
Page 31 of 41			
			
	Reprice	string	internal entity value
	IsPriceBreakup
Available	boolean	internal entity value
	IsCancelation Policy Availble	boolean	internal entity value
	IsCache	boolean	internal entity value
	MinStay	integer	minimum nights of stay
	ExtraBedCount	integer	only if applicable, no. of extra beds will be provided
	Adult	integer	total no. of adult passenger in the room
	Children		children array with count
(Note: maximum 4 children are allowed in a room)
	Count	integer	total no. of children in the room if applicable
	Child Age	integer	child with Identifier and age
(Note: min age for child is 1 and max age 17 )
	RoomName	string	name of the room
	Meal	string	meal type description, possible values “Room Only”,
”Bed and Breakfast” etc.
	RateType	string	rate type description (Refundable or Non Refundable)
	RateKey	string	a unique id/key associated with specific room
	Status	string	shows the availability, possible values are Available and Not Available
	BedTypes		
	BedType	string	type of beds
	Policies		
	Policy		
	Condition		
	FromDate	date time	date from when charges will be applied
	ToDate	date time	date till when charges will be applied
	Timezone	string	applicable time zone based on destination
	Unit	integer	no. of units, if applicable
	Text	string	amount in customer currency, if applicable
	FromTime	string	time from when charges will be applied
	ToTime	string	time till when charges will be applied
	Percentage	string	cancellation charges in percentage
	Nights	string	cancellation charges in no of nights
	Fixed	string	cancellation charges in fixed amount
	SupplierFixed	string	supplier cancellation charges in fixed amount
	ApplicableOn	string	type of charges applicable
	TextCondition	string	free text/remarks
	Type	string	returns policy types
possible value are “CAN”= Cancellation Policy, “NOS”=No Show Policy,
“MOD”=Modified
	Currency	string	three digits ISO standard currency code (e.g.: AED, GBP, USD)
	SupplierCurrency	string	internal supplier currency code
Page 32 of 41			
			
	Promotions		
	Code	string	promotion code
	Amount	decimal	promotion amount
	SupplierAmount	decimal	promotion supplier amount
	Text	string	promotion free text
	PriceBreakdownRules		
	PerNightInfo		
	StartDate	date time	start date
	EndDate	date time	end date
	SupplierAmount	decimal	supplier charges per night
	Amount	decimal	charges per night
			
	Remarks		
	Remark		
	Type	string	remarks type, if applicable
	Text	string	remarks text, if applicable
Hotel Booking Method
The Hotel Booking method can be used to book a selected hotel room option by submitting all of the necessary details shown below in the Hotel Booking Request Structure Details.
 
In the request, the unique Ratekey associated to specific room options must be given, which is returned in the Hotel Price and Availability or Reprice response.
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Page 33 of 41			
￼
￼
Hotel Booking Request
	
	


￼
￼
Hotel Booking Request Structure Details
 
 
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
DestinationCode	string	Mandatory	DestinationCode are the internally mapped unique codes for all the destinations/cities
HotelCode	string		internal mapped unique hotel code
GroupCode	string	Mandatory	internal group code
			
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
Nationality	string	Mandatory	Nationality code as in Country Master. 2 digits ISO standard country code
CustomerRefNumber	string	Mandatory	Agent Reference Number / Unique identification
number to be passed in booking request
Rooms			
Room			
RoomIdentifier	string	Mandatory	room’s serial number
			
RateKeys			
RateKey		Mandatory	a unique id/key associated with specific room
Guests			
Guest			
IsLeadPAX	boolean	Mandatory	there should be one mandatory lead passenger
Type	string	Mandatory	possible values adult/child
Title, text	string	Mandatory	possible vales Mr., Mrs., Miss & Master
FirstName	string	Mandatory	passenger first name
LastName	string	Mandatory	passenger last name
Age	integer	Mandatory	passenger age
			
Price			
Gross	decimal	Mandatory	total gross price per room
Net	decimal	Mandatory	total net per room
Tax	decimal	Mandatory	total tax per room
￼
 
 
￼
Hotel Booking Response
	
	


￼
￼
Hotel Booking Response Structure Details
 
 
	Data Type	Description
GeneralInfo		
ApiKey	string	unique id assigned to the customer
SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking
process)
TimeStamp	date time	current date and time of the search
DestinationCode	string	DestinationCode are the internally mapped unique codes for all the
destinations/cities
HotelCode	string	internal mapped unique hotel code
SupplierHotelCode	string	supplier mapped unique hotel code
GroupCode	string	internal group code
CountryCode	string	two digits ISO standard country code (e.g.: AE, GB, US)
SupplierGroupCode	string	internal supplier group code
Currency	string	three digits ISO standard currency code (e.g.: AED, GBP, USD)
Nationality	string	Nationality code as in Country Master. 2 digits ISO standard country code
CustomerRefNumber	string	Agent Reference Number / Unique identification number to be
passed in booking request
BookingCreation	date time	Booking creation date
HotelConfirmationNumber	string	confirmation number provided by hotel
ADSConfirmationNumber	string	internal confirmation number
SupplierConfirmationNumber	string	confirmation number provided by supplier
Status	string	booking confirmation or failure status
Rooms		
Room		
RoomIndex	integer	room’s index value
RateKey	string	a unique id/key associated with specific room
Status	string	booking confirmation or failure status
RoomIdentifier	integer	room’s serial number
GroupCode	integer	internal group code
SupplierGroupCode	integer	internal supplier group code
ShortCode	string	internal supplier name
ContractType	string	internal contract type value
RoomCombinationId	integer	room’s combination identifier
MarriageIdentifier	integer	room’s combination identifier
Reprice	string	internal entity value
IsPriceBreakup
Available	boolean	internal entity value
IsCancelation Policy	boolean	internal entity value
￼
￼
 
Availble		
IsCache	boolean	internal entity value
MinStay	integer	minimum nights of stay
ExtraBedCount	integer	only if applicable, no. of extra beds will be provided
Adult	integer	total no. of adult passenger in the room
Children	integer	children array with count
(Note: maximum 4 children are allowed in a room)
Count	integer	total no. of children in the room if applicable
Child Age	integer	child with Identifier and age
(Note: min age for child is 1 and max age 17 )
 
 
 
Hotel Cancelation Method
The Hotel Cancellation method can be used to cancel an existing reservation. This method allows for entire booking cancellation, and our API does not allow room wise cancellation.
 
Hotel Cancelation Request
	
	


￼
￼
Hotel Cancelation Request Structure Details
 
 
	Data Type		Description
SessionId	string	Mandatory	session Id needs to be passed in the request returned in
the hotel search response
Currency	string	Mandatory	three digits ISO standard currency code (e.g.: AED, GBP, USD)
			
ADSConfirmationNumber	string	Mandatory	confirmation Number returned in the booking response
CancelRooms			
CancelRoom			
RoomIdentifier	integer	Mandatory	room identifiers
 
 
 
	
	
Hotel Cancelation Response

￼
￼
Hotel Cancelation Response Structure Details
	Data Type	Description
GeneralInfo		
ApiKey	string	unique id assigned to the customer
SessionId	string	unique id or token returned in the search response
(Note: This session Id will be passed in all the other requests throughout the booking
process)
TimeStamp	date time	current date and time of the search
Monetary		
Currency	string	exchange currency information
Code	string	currency code(ISO standard 3 digit currency code)
ExchangeRate	decimal	current exchange rate information based on USD
Text	string	currency code ISO standard 3 digit currency code)
ADSConfirmationNumber	string	confirmation Number returned in the booking response
Status	string	cancellation success or failure status
 
Hotel Booking Details (Retrieve) Method
 
The Hotel Booking Details method can be used to retrieve the booking details after the booking confirmation and cancelation.
 
 
Hotel Booking Details (Retrieve) Request
 
	
	


￼
￼
Hotel Booking Details (Retrieve) Response
 
	
	

 
 
Booking Status:
 
Not Confirmed = 1, Confirmed = 2,
Failed = 3,
Cancelled = 4, Cancellation Failed = 9,
