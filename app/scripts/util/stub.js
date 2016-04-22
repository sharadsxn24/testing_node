/**
 * Created by anuraggrover on 05/08/15.
 */

(function (W) {
    'use strict';

    var MEMORY_OBJ = {};

    var bootstrapResponse = {"region":{"id":1,"name":"Delhi NCR"},"tags":[{"name":"featured","offers":[{"id":286,"merchant_name":"Shoppers Stop","title":"Rs 200 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/154\/medium\/symbol.jpg?1449041480","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/286\/medium\/bigstock-store-17352236-2.jpg?1449039877"},{"id":292,"merchant_name":"Amazon.in","title":"Extra 10% off on Amazon Fashion","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/71\/medium\/Amazon.jpg?1442415928","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/292\/medium\/Fashion-And-Modern-Youth.jpg?1449474350"},{"id":47,"merchant_name":"Dominos","title":"20% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/30\/medium\/Dominos_final.jpg?1441973593","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/47\/medium\/open-uri20150821-7727-8e0y35.jpg?1441973660"},{"id":285,"merchant_name":"OYO rooms","title":"35% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/64\/medium\/new-oyo-rooms-logo.jpg?1449059978","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/285\/medium\/Oyo_rooms.jpg?1448984580"},{"id":166,"merchant_name":"eBay","title":"Upto Rs 1500 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/27\/medium\/eBay_final.jpg?1441973582","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/166\/medium\/ebay_3.jpg?1447925536"},{"id":288,"merchant_name":"Pepperfry","title":"Rs 500 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/101\/medium\/pepperfry-large.jpg?1445943713","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/288\/medium\/Pepperfry.jpg?1449131738"},{"id":174,"merchant_name":"Lenskart","title":"Rs 500 Gift Voucher","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/31\/medium\/Lenskart_PNG.jpg?1441973594","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/174\/medium\/Lenkskart_2.jpg?1447839558",}],"page_count":3},{"name":"restaurants","offers":[{"id":55,"merchant_name":"Dominos","title":"Free Garlic Bread & Dip","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/30\/medium\/Dominos_final.jpg?1441973593","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/55\/medium\/open-uri20150821-7727-1vbqcoj.jpg?1441973663"},{"id":49,"merchant_name":"Cookie Man","title":"15% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/7\/medium\/Cookie_Man.jpg?1441973572","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/49\/medium\/Cookieman.jpg?1441973661"},{"id":185,"merchant_name":"Flying Cakes","title":"15% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/92\/medium\/Flying_Cakes.jpg?1444733801","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/185\/medium\/Flying_Cakes.jpg?1444734500"},{"id":235,"merchant_name":"Burger Singh","title":"15% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/122\/medium\/Burger_Singh.jpg?1446545238","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/235\/medium\/burger_singh.jpg?1446546395"},{"id":198,"merchant_name":"Giani","title":"10% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/98\/medium\/Giani.jpg?1445588212","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/198\/medium\/Giani.jpg?1445592721"},{"id":21,"merchant_name":"Cafe 101","title":"20% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/18\/medium\/Cafe_101-18-PNG.jpg?1441973578","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/21\/medium\/open-uri20150821-7727-13g8nsa.jpg?1441973649"},{"id":244,"merchant_name":"The Chinese Hut","title":"10% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/123\/medium\/The_Chinese_Hut.jpg?1447669275","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/244\/medium\/492258895.jpg?1449486788"}],"page_count":2},{"name":"online","offers":[{"id":6,"merchant_name":"Naaptol","title":"Rs 200 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/56\/medium\/Naaptol_PNG.jpg?1441973613","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/6\/medium\/Naaptol.jpg?1441973644"},{"id":192,"merchant_name":"UrbanClap","title":"Rs 500 off on Salon at Home for Women","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/94\/medium\/Urban_Clap.jpg?1445335776","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/192\/medium\/Urban_Clap1.jpg?1445338236"},{"id":253,"merchant_name":"Healthkart","title":"Rs 50 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/44\/medium\/HealthKart.jpg?1441973609","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/253\/medium\/Healthkart_2.jpg?1447760449"},{"id":58,"merchant_name":"Fab Furnish","title":"15% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/39\/medium\/Fab_Furnish.jpg?1441973602","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/58\/medium\/open-uri20150821-7727-177805f.jpg?1441973665"},{"id":252,"merchant_name":"newU","title":"Rs 100 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/70\/medium\/newu.jpg?1442302706","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/252\/medium\/NewU_%281%29.jpg?1447408424"},{"id":3,"merchant_name":"Stalkbuylove","title":"20% off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/43\/medium\/Stalkbuylove-43-PNG.jpg?1441973604","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/3\/medium\/open-uri20150821-7727-eprczz.jpg?1441973643"},{"id":42,"merchant_name":"VLCC","title":"Rs 500 off","merchant_logo":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/merchants\/2\/medium\/VLCC_New.jpg?1441973570","offer_image":"http:\/\/hoppr-image.s3.amazonaws.com\/coupons-production\/offers\/42\/medium\/VLCC.jpg?1441973651"}],"page_count":6}],"diwali":false,hash:"15c9b1b2a728530c226cd5837d6de4f2"},
        fullCoupons = {"offers":[{"id":114,"merchant_description":"Postegully is an online shopping destination for Posters, Phone Cases, T-Shirts, Notepads, Stickers, Keychains, Laptop Skins, Badges, Mousepads & More.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/32/large/Postergully.png?1441973595","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/32/medium/Postergully.jpg?1441973595","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/32/small/Postergully.png?1441973595"},"merchant_name":"Postergully","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/114/large/open-uri20150821-7727-3mdlqx?1441973697","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/114/medium/open-uri20150821-7727-3mdlqx.jpg?1441973697","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/114/small/open-uri20150821-7727-3mdlqx?1441973697"},"terms":"Offer valid only on website\r\nOffer can be redeemed on www.postergully.com\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"20% off"},{"id":3,"merchant_description":"StalkBuyLove, an online retail company founded by Europe based experts in the fashion industry provides chic and trendy apparel suited to the tastes of every fashion forward lady at addictive prices.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/43/large/Stalkbuylove-43-PNG.png?1441973604","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/43/medium/Stalkbuylove-43-PNG.jpg?1441973604","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/43/small/Stalkbuylove-43-PNG.png?1441973604"},"merchant_name":"Stalkbuylove","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/3/large/open-uri20150821-7727-eprczz?1441973643","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/3/medium/open-uri20150821-7727-eprczz.jpg?1441973643","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/3/small/open-uri20150821-7727-eprczz?1441973643"},"terms":"Offer valid only on website\r\nValid on min purchase of Rs 800\r\nOffer can be redeemed on http://bit.ly/1FMonI9 \r\nApplicable on select styles \r\nOffer is not valid on products already on discount\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"20% off"},{"id":42,"merchant_description":"VLCC offers scientific weight loss solutions and therapeutic approach to beauty treatments, making beauty, fitness and health accessible","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/2/large/VLCC_New.png?1441973570","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/2/medium/VLCC_New.jpg?1441973570","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/2/small/VLCC_New.png?1441973570"},"merchant_name":"VLCC","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/42/large/VLCC.png?1441973651","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/42/medium/VLCC.jpg?1441973651","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/42/small/VLCC.png?1441973651"},"terms":"Min. bill of Rs 800 to be paid, get additional services worth Rs 500 on makeup and hair services\r\nDiscount applicable on makeup and hair services\r\nPrior appointment mandatory\r\nNot applicable at VLCC Day Spa and Franchise Outlets\r\nShow the screen at the reception before your session to avail the services\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Rs 500 off"},{"id":218,"merchant_description":"Online","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/113/large/Rediff_Shopping.jpg?1446023789","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/113/medium/Rediff_Shopping.jpg?1446023789","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/113/small/Rediff_Shopping.jpg?1446023789"},"merchant_name":"Rediff Shopping","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/218/large/Rediff_Shopping_2.jpg?1446026164","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/218/medium/Rediff_Shopping_2.jpg?1446026164","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/218/small/Rediff_Shopping_2.jpg?1446026164"},"terms":"Valid on min purchase of Rs 799\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Rs 150 off"},{"id":206,"merchant_description":"Online shopping","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/104/large/shopnineteen.jpg?1445934297","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/104/medium/shopnineteen.jpg?1445934297","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/104/small/shopnineteen.jpg?1445934297"},"merchant_name":"Shopnineteen","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/206/large/Shopnineteen.jpg?1445935033","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/206/medium/Shopnineteen.jpg?1445935033","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/206/small/Shopnineteen.jpg?1445935033"},"terms":"Offer valid only on Tops\r\nOffer can be redeemed on http://bit.ly/1KCodzU\r\nVisit cart to apply coupon code\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"25% off"},{"id":214,"merchant_description":"Online shopping","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/111/large/Styletag.png?1445941868","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/111/medium/Styletag.jpg?1445941868","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/111/small/Styletag.png?1445941868"},"merchant_name":"Styletag","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/214/large/StyleTag.jpg?1445948394","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/214/medium/StyleTag.jpg?1445948394","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/214/small/StyleTag.jpg?1445948394"},"terms":"Offer can be redeemed on http://bit.ly/1jNOZ3u\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Additional 30% off"},{"id":169,"merchant_description":"ArtisanGilt.com is an online store which sells novel, authentic & affordable handmade & designer lifestyle products.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/83/large/artisan_Gilt.png?1443523745","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/83/medium/artisan_Gilt.jpg?1443523745","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/83/small/artisan_Gilt.png?1443523745"},"merchant_name":"ArtisanGilt","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/169/large/Artisan_gilt.jpg?1443525141","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/169/medium/Artisan_gilt.jpg?1443525141","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/169/small/Artisan_gilt.jpg?1443525141"},"terms":"Offer valid only on website\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Additional 10% off"},{"id":117,"merchant_description":"Pehraan brings to you traditional form of Indian ethnic wear. Shop online for women kurta, kurti, Indo-Western tops, bottoms, ladies suits and much more desi stuffs.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/61/large/Pehraan-61-PNG.png?1441973615","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/61/medium/Pehraan-61-PNG.jpg?1441973615","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/61/small/Pehraan-61-PNG.png?1441973615"},"merchant_name":"Pehraan","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/117/large/open-uri20150821-7727-zk58s2?1441973699","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/117/medium/open-uri20150821-7727-zk58s2.jpg?1441973699","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/117/small/open-uri20150821-7727-zk58s2?1441973699"},"terms":"Offer valid only on website\r\nOffer not applicable on already discounted products\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"35% off"},{"id":5,"merchant_description":"Florists In India provides online flower delivery service all over India & world. They also provide services like Best Sellers, Cakes, Chocolates, Sweets, Soft Toys and many more delivery at affordable prices.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/57/large/Floristsinindia.png?1441973614","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/57/medium/Floristsinindia.jpg?1441973614","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/57/small/Floristsinindia.png?1441973614"},"merchant_name":"Florists In India","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/5/large/Florists_In_India.jpg?1441973643","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/5/medium/Florists_In_India.jpg?1441973643","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/5/small/Florists_In_India.jpg?1441973643"},"terms":"Offer valid only on website\r\nNo min purchase value\r\nOffer can be redeemed on http://www.floristsinindia.com/\r\nNot applicable on multiple products per transaction\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"20% off"},{"id":183,"merchant_description":"Apprarel","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/90/large/indigo-logo.png?1444727903","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/90/medium/indigo-logo.jpg?1444727903","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/90/small/indigo-logo.png?1444727903"},"merchant_name":"Indigo Nation","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/183/large/Indigo_Nation_2.jpg?1446025526","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/183/medium/Indigo_Nation_2.jpg?1446025526","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/183/small/Indigo_Nation_2.jpg?1446025526"},"terms":"Valid on min purchase of Rs 3000\r\nApplicable at all Indigo Nation stores across India\r\nNot valid in large format retail stores like Central, Reliance Trends , Pantaloons etc\r\nNot valid on online purchases\r\nValid till 15th Nov'15\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPresent the coupon before bill is generated\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Rs 500 off"},{"id":4,"merchant_description":"10kya.com is world's first passion discovery platform. It is a unique store that offers gear and specialty tours and workshops in human passions like Adventure, Sports, Hobbies, Photography, Art, Music, Fashion & Style.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/50/large/10kya_logo_06062015.png?1441973611","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/50/medium/10kya_logo_06062015.jpg?1441973611","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/50/small/10kya_logo_06062015.png?1441973611"},"merchant_name":"10kya.com","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/4/large/open-uri20150821-7727-mxphm7?1441973643","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/4/medium/open-uri20150821-7727-mxphm7.jpg?1441973643","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/4/small/open-uri20150821-7727-mxphm7?1441973643"},"terms":"Offer valid only on website\r\nOffer valid on min purchase of Rs 1000\r\nOffer can be availed upto 2 times from one login\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"20% off"},{"id":62,"merchant_description":"Sportsjam is one stop shop for Online Sports & Fitness Equipment needs.They offer a huge variety to choose from, at competitive prices and quick delivery.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/36/large/sportsjam-logo.png?1441973601","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/36/medium/sportsjam-logo.jpg?1441973601","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/36/small/sportsjam-logo.png?1441973601"},"merchant_name":"Sportsjam","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/62/large/open-uri20150821-7727-9odd7e?1441973668","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/62/medium/open-uri20150821-7727-9odd7e.jpg?1441973668","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/62/small/open-uri20150821-7727-9odd7e?1441973668"},"terms":"Offer valid only on website\r\nMax. discount upto Rs. 500 per transaction\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"10% off"},{"id":109,"merchant_description":"Bookmyflowers is leading online florist based in India which offers fresh and rare flowers to adorn your homes or gift to your loved ones. Their entire range of products includes fresh flowers, artificial flowers, cakes & chocolates, combo gifts and much more.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/53/large/Bookmyflowers-53-PNG.png?1441973612","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/53/medium/Bookmyflowers-53-PNG.jpg?1441973612","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/53/small/Bookmyflowers-53-PNG.png?1441973612"},"merchant_name":"Bookmyflowers","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/109/large/open-uri20150821-7727-i9q12c?1441973690","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/109/medium/open-uri20150821-7727-i9q12c.jpg?1441973690","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/109/small/open-uri20150821-7727-i9q12c?1441973690"},"terms":"Offer valid only on website\r\nNot applicable on International deliveries\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"15% off"},{"id":14,"merchant_description":"Cyankart is India's Finest Style Lounge for Apparel, Accessories & More‎. It provides the best prices and the best online shopping experience every time, guaranteed.","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/47/large/Cyankart-47-PNG.png?1441973610","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/47/medium/Cyankart-47-PNG.jpg?1441973610","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/47/small/Cyankart-47-PNG.png?1441973610"},"merchant_name":"Cyankart.com","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/14/large/cya.jpg?1441973647","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/14/medium/cya.jpg?1441973647","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/14/small/cya.jpg?1441973647"},"terms":"Offer valid only on website\r\nValid on total bill\r\nCannot be combined with any other offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"15% off"},{"id":213,"merchant_description":"Online Sports Shopping","merchant_logo":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/110/large/sports365.png?1445941256","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/110/medium/sports365.jpg?1445941256","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/merchants/110/small/sports365.png?1445941256"},"merchant_name":"Sports365","offer_image":{"large":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/213/large/Sports365.jpg?1445947922","medium":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/213/medium/Sports365.jpg?1445947922","small":"http://hoppr-image.s3.amazonaws.com/coupons-production/offers/213/small/Sports365.jpg?1445947922"},"terms":"Offer valid on min purchase of Rs 750\r\nOffer can be redeemed on http://bit.ly/1Mghhd3\r\nCannot be combined with any offer/discount/promotion\r\nCannot be redeemed in cash\r\nPrices exclusive of all taxes\r\nHike shall not be held responsible for any liabilities/claims arising out of use of this coupon","title":"Rs 250 off"}],"page_count":4},
        regions = [{"id":5,"name":"Bengaluru"},{"id":1,"name":"Delhi NCR"},{"id":7,"name":"Gujarat"},{"id":3,"name":"Hyderabad"},{"id":6,"name":"Kolkata"},{"id":8,"name":"Madhya Pradesh"},{"id":2,"name":"Mumbai"},{"id":9,"name":"Others"},{"id":4,"name":"Punjab"},{"id":11,"name":"Rajasthan"},{"id":12,"name":"Rest of Maharashtra"},{"id":10,"name":"Tamil Nadu"},{"id":13,"name":"Uttar Pradesh"}],
        tnc = "Offer can be redeemed on http://amzn.to/1N93V5R\r\nCannot be combined with any other offer/discount/promotion \r\nCannot be redeemed in cash \r\nPrices exclusive of all taxes \r\nHike shall not be held responsible for any liabilities/claims arising out of this coupon",
        hash = "15c9b1b2a728530c226cd5837d6de4f2";

    var noop = function () {

    };

    W.PlatformBridge = {
        onLoadFinished: noop,

        setDebuggableEnabled: noop,

        replaceOverflowMenu: noop,

        updateOverflowMenu: noop,

        allowBackPress: noop,

        allowUpPress: noop,

        getFromCache: function (callbackId, key) {
            if (key === 'isOptInDone') {
                W.callbackFromNative(callbackId, false);
            } else if (key === 'isRegionSelected') {
                W.callbackFromNative(callbackId, false);
            } else if (key === 'bootstrapData') {
            	W.callbackFromNative(callbackId, MEMORY_OBJ[key]);
        	} else if (key === 'couponshash') {
        		W.callbackFromNative(callbackId, MEMORY_OBJ[key]);
        	} else {
                W.callbackFromNative(callbackId, false);
            }
        },

        doGetRequest: function (callbackId, params) {
            var baseResponse = {
                    status_code: 200,
                    status: 'success'
                },
                responseJSON;

            if (params.indexOf('defaultRegion') !== -1) {
                baseResponse.response = JSON.stringify({
                    id: regions[0].id

                });
            } else if (params.indexOf('regions') !== -1) {
                responseJSON = {
                    regions: regions
                };

                W.setTimeout(function () {
                    baseResponse.response = JSON.stringify(responseJSON);
                    W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));
                }, 3000);

                return;
            } else if (params.indexOf('offers') !== -1 && params.indexOf('terms') === -1) {
                responseJSON = fullCoupons;
            } else if (params.indexOf('bootstrap') !== -1) {
                responseJSON = bootstrapResponse;
            } else if (params.indexOf('region') !== -1) {
                responseJSON = {
                    region_id: 9
                };
            } else if (params.indexOf('terms') !== -1) {
            	responseJSON = {
            		offer: {
            			terms: tnc
            		}
            	};

            	// doing this to make it identical to the server response. 
            	// TODO. Change it when API gets sorted.

            } else if (params.indexOf('hash') !== -1) {
            	responseJSON = hash;
            	console.log("getHash");
            } 

            baseResponse.response = JSON.stringify(responseJSON);
            W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));	
        },

        doPostRequest: function (callbackId, data) {
            var baseResponse = {
                status_code: 200,
                status: 'success'
            };

            data = JSON.parse(data);

            if (data.url.indexOf('issue') !== -1) {
                baseResponse.response = JSON.stringify({
                    "coupon": {
                        "coupon_type": "static",
                        "kind": "app",
                        "base_url": "http://m.cyankart.com",
                        "code": "LETSCYAN"
                    }
                });
            }

            W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));
        },

        putInCache: function(key, val){
        	MEMORY_OBJ[key] = val;
			localStorage['hikeCoupons'] = JSON.stringify(MEMORY_OBJ); 
        },

        checkConnection: function (callbackId) {
            W.callbackFromNative(callbackId, 1);
        },

        logAnalytics: function () {
            console.log('Android log:', Array.prototype.slice.call(arguments, 0).join(','));
        },

        logFromJS: noop,

        updateHelperData: noop
    };

    W.Bugsnag = {};

    setTimeout(function () {
        platformSdk.appData = {
            platformUid: 'abc',
            helperData: {
                env: 'dev'
            }
        };

        if (localStorage.hikeCoupons){
        	try {
        		MEMORY_OBJ = JSON.parse(localStorage.hikeCoupons);	
        	} catch(e) {
        		MEMORY_OBJ = {};
        	}
        }
        	
        platformSdk.events.publish('webview/data/loaded');
    }, 1500);

})(window);