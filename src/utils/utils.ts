import {IOfferDetails} from "../interfaces/IOfferDetails";

export function isOffersArraysEqual(offers: IOfferDetails[], offersFromRedis: IOfferDetails[]): boolean {
    return offers.every(offer => offersFromRedis.find(redisOffer =>
        offer.name === redisOffer.name &&
        offer.link === redisOffer.link &&
        offer.imageLink === redisOffer.imageLink &&
        offer.price === redisOffer.price &&
        offer.address === redisOffer.address
    ))
}
