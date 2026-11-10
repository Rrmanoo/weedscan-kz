import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hash, Percent, Leaf, TrendingUp, ZoomIn } from "lucide-react";

// Real field images: [zone 0-8][block 0-8][img 0-3]
const ZONE_IMAGES: string[][][] = [
  [["G0030412_JPG.rf.aee989756be7f401518dc929dcb04f33.jpg","G0030415_JPG.rf.f32baf5dc70e0fc4f346ac1e9d45eb62.jpg","GOPR0176_JPG.rf.a579bec1c92f3a0a1ee67bf1ef82a919.jpg","GOPR0177_JPG.rf.11372a46733c7a17cd85654ee366b3b9.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","GOPR0202_JPG.rf.5409f73f03c8ab5d6ca7747b79de8ede.jpg","GOPR0203_JPG.rf.5a197dff8a749c1e1029b24b19c0b535.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0224_JPG.rf.bb2aafdbd10683a487391d30dd3931f9.jpg","GOPR0225_JPG.rf.ec51e0a222a9aef05c4647e38d0312f0.jpg","GOPR0226_JPG.rf.9f0d7873fb34210c2ada7eed013a27d6.jpg"],["GOPR0244_JPG.rf.ef86a7b682ec9b2431511415bc6e1792.jpg","GOPR0245_JPG.rf.3ad1fd6ccf1f26c9f04f5156502f7362.jpg","GOPR0246_JPG.rf.ae58ed59b0413d162c9f683c3b6227f7.jpg","GOPR0247_JPG.rf.918ab01c8bbd6aeb841edf0dedbf3fcb.jpg"],["GOPR0550_JPG.rf.b09ef5d19a95b2a6b4693601a8b0f646.jpg","GOPR0552_JPG.rf.77866db41f5812172efc8d5702500483.jpg","GOPR0553_JPG.rf.b141754be820cd6c9a775cd243b60aec.jpg","GOPR0554_JPG.rf.9890c07488db3c94975d7646d25b6930.jpg"],["GOPR0579_JPG.rf.4a5bf83d3ad3a327fb0170f445e3a9e6.jpg","GOPR0580_JPG.rf.f7267e8ae6a37920dfc1d796dffd9ccd.jpg","GOPR0582_JPG.rf.4c48c034f706a2d4609baaadab696977.jpg","GOPR0583_JPG.rf.58742ac7ce8a15ced3f0db927551a9b0.jpg"],["GOPR0610_JPG.rf.0ab7a94f0c091945b3ba8988ead1a310.jpg","GOPR0611_JPG.rf.7695dd625fbd031f2559c0fce8068938.jpg","GOPR0612_JPG.rf.c25f7d89130eb5e6b2c18ce27c4f1c13.jpg","GOPR0613_JPG.rf.254987fba39c0459146e90f9cb914c4f.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0621_JPG.rf.4684ddec9126b12e5552f219f5d998d6.jpg","GOPR0622_JPG.rf.5bb39738d7eab78598d07e40251769a8.jpg","GOPR0623_JPG.rf.e2f3c80b934a53730eaa959ebefcb0fb.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0686_JPG.rf.f3c4d0982bc5958b288034d8f0a3631f.jpg","GOPR0687_JPG.rf.892060074ef74eeedff9c1fc06bbc49d.jpg","GOPR0688_JPG.rf.886bba9c50ee00f6940b551a9b862bfe.jpg"]],
  [["GOPR0795_JPG.rf.87e75038761d3825d0fa10a57c743da6.jpg","GOPR0796_JPG.rf.77fd71cfc93391df15aa779459347677.jpg","GOPR0797_JPG.rf.2799b4567ac4d3cd24106bf0112a5905.jpg","GOPR0798_JPG.rf.1b829ad43ef7a087a93bd553684de558.jpg"],["GOPR0806_JPG.rf.f5c5713261a547bcb37723e72ce752c5.jpg","GOPR0807_JPG.rf.4b6933a07e9c0febd0ad0a12e4c572dc.jpg","GOPR0808_JPG.rf.be84424273f89788347052340407f490.jpg","GOPR0809_JPG.rf.840b418a266e608d2cc2456ad605c000.jpg"],["GOPR0817_JPG.rf.23f81b90df9f944a1a08bcf4a740996e.jpg","GOPR0818_JPG.rf.936314ae295def16be719707e833713b.jpg","GOPR0819_JPG.rf.89e71c6aa25632617030168b4888431c.jpg","GOPR0820_JPG.rf.d094b0ab748fa93132c3e02e41f747d4.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0827_JPG.rf.15376e5a1a365f8bbb288cd7e157ef6f.jpg","GOPR0828_JPG.rf.bfa719fda000b9dff7931a537d60783b.jpg","GOPR0829_JPG.rf.4bfc22a038ab61a81daf52144efd17e9.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0830_JPG.rf.2648b8e6b9655c3ed8b742f4afe223c8.jpg","GOPR0841_JPG.rf.63997dbf0c5a5e02a57584dd2add1344.jpg","GOPR0852_JPG.rf.1b3724d3fb8e00bdd5b8ce433d0b5f29.jpg"],["GOPR0861_JPG.rf.a7e83571af8c2323e27bd99e8277cabc.jpg","GOPR0862_JPG.rf.d1060d80331347977739cb79285deed8.jpg","GOPR0863_JPG.rf.e36a639eb43bed5b4128989a79593441.jpg","GOPR0864_JPG.rf.695261bb1f69a592991a143cb3b48242.jpg"],["GOPR0882_JPG.rf.0ea2bc34c4e9bcfad443311e4ae4a39e.jpg","GOPR0883_JPG.rf.8edddd20bcdfcc8a37bf63b71d05c4cf.jpg","GOPR0884_JPG.rf.6b99319008295e2d8993b22475cda5a7.jpg","GOPR0885_JPG.rf.05b41158b9f8d0f0cf880385099f0ec3.jpg"],["G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg","GOPR0894_JPG.rf.7a6899387b5c596f5f7875764467c7a2.jpg","GOPR0895_JPG.rf.74fb7f18402c279879193a813ac99eb1.jpg","GOPR0896_JPG.rf.d6abe17a0cfe61b8fc88b759e4bda454.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","GOPR0911_JPG.rf.09a0aee7c98cf1bd358f21a0b4b7d4d5.jpg","GOPR0912_JPG.rf.ca093cbc7dcc59ef8f516fd17d09b24b.jpg"]],
  [["GOPR0937_JPG.rf.cd3ccd563a12b66a95fdaf1b32b03f4b.jpg","GOPR0938_JPG.rf.bbf7e7a24cfc88f6c63cd315284f4299.jpg","GOPR0939_JPG.rf.8a235cb7d7730b4d1110a4b61d5ee8ed.jpg","GOPR0943_JPG.rf.f33a7238747f2038f4d2a823cd22ccd2.jpg"],["GOPR0953_JPG.rf.3dee951b2a556bd6aaf2abc06d59947f.jpg","GOPR0955_JPG.rf.c19f7ab73ac31d77f1a1c4a37fa7a021.jpg","GOPR0956_JPG.rf.fd22d480c47824886572fa66fd585b28.jpg","GOPR0958_JPG.rf.b5c79aa1ff0597abe64a00f2c845c334.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["GOPR2417_JPG.rf.03666c1a250a172053359d0fb5731117.jpg","GOPR2418_JPG.rf.4fa696b7546fbe5c9fc4e2f24f467cce.jpg","GOPR2419_JPG.rf.b58e94bbc0b805c57c0dfb75013a5c03.jpg","GOPR2420_JPG.rf.e5b1d83a2f5246a7efb44b6036dae2f0.jpg"],["GOPR2368_JPG.rf.b19bad0842632ff9367a37b0065ffa67.jpg","GOPR2369_JPG.rf.d2e12bc27dc80cd7d52b8a310a8d9272.jpg","GOPR2370_JPG.rf.c2fc9d99e4bff8a449b1c80773046509.jpg","GOPR2371_JPG.rf.b9377d46f36a00ba0792be2d9fa93085.jpg"],["GOPR2280_JPG.rf.16d7e8a715eab0d1958f54e217c0ebd2.jpg","GOPR2281_JPG.rf.3547f902e3a06f0c93ee05fe78f1d3d3.jpg","GOPR2282_JPG.rf.1623b3bcdcbceed7704218179659e286.jpg","GOPR2283_JPG.rf.49edcef28b4be2f93098fc85741f8cd1.jpg"],["GOPR2234_JPG.rf.ea3b7f2836008327022d97b4b95784d8.jpg","GOPR2235_JPG.rf.a71fd293fd581193e03c030a90393a93.jpg","GOPR2236_JPG.rf.74be801e9d5649aab37037407961c42c.jpg","GOPR2237_JPG.rf.1e6a5ded296cca519cc1985f5181317d.jpg"],["GOPR2208_JPG.rf.48af1200542af0c5d20287fa57cc3a2b.jpg","GOPR2209_JPG.rf.a61a7cc0fe3a8554677f719a1fa69838.jpg","GOPR2210_JPG.rf.77b5a6d3a36fe7aef4cb5e97301d3098.jpg","GOPR2211_JPG.rf.6b935109804ae4f05eb497eebf4e7a6d.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","GOPR2196_JPG.rf.2a5874d464a39e81986468428cd29333.jpg"]],
  [["G0030412_JPG.rf.aee989756be7f401518dc929dcb04f33.jpg","G0030413_JPG.rf.83ad55fcb15bb399447771deefb5f4cd.jpg","G0030414_JPG.rf.328e91fcd7de5714fe411415575649df.jpg","G0030415_JPG.rf.f32baf5dc70e0fc4f346ac1e9d45eb62.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR1041_JPG.rf.6634e389f431554beafc80a33b8162ca.jpg","GOPR1042_JPG.rf.20788bdffe7729cde419e17765682bf1.jpg","GOPR1043_JPG.rf.13185d71af926d6596a8a4a2fa3c4858.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","GOPR2175_JPG.rf.860e411d4f14281a4521774c6f5b79f6.jpg","GOPR2176_JPG.rf.333501bf6f0c2c2d413e18614ff30f65.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR1031_JPG.rf.d71e8b530dec415968b08ec696d21b7e.jpg","GOPR1032_JPG.rf.61f27786bc508c1f67277a0b642199d4.jpg","GOPR1033_JPG.rf.340ef61f753feefbf96ed01548046599.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["GOPR2184_JPG.rf.ec001f1518a49a9619df719bc05219c5.jpg","GOPR2185_JPG.rf.998876fe661ed29a8a09423651271fa0.jpg","GOPR2186_JPG.rf.a2ec80b72ffa4e56fdfbc22b99672ec1.jpg","GOPR2187_JPG.rf.8fcbbd4e5706f14c01a1aeac79b384b6.jpg"],["GOPR1006_JPG.rf.0ef26a5b616a8526affc3d5252ce91ae.jpg","GOPR1007_JPG.rf.1f6dd711914ade94c0e85e4635ffa32e.jpg","GOPR1009_JPG.rf.737f20bbfbe4cb35b7db131dfe9f6d72.jpg","GOPR1010_JPG.rf.5471a4a55739a7553af64c3653c70753.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0969_JPG.rf.986d26a36e32a806f9c482f8c680a1a9.jpg","GOPR0970_JPG.rf.06d6df2e3b25cffae1d73ef0a9da5c4f.jpg","GOPR0972_JPG.rf.7edd9a8a1d17d76a9b328f16a59d57aa.jpg"]],
  [["GOPR0953_JPG.rf.3dee951b2a556bd6aaf2abc06d59947f.jpg","GOPR0954_JPG.rf.4bf2cdde3d94ebca58e95f1e5197c682.jpg","GOPR0955_JPG.rf.c19f7ab73ac31d77f1a1c4a37fa7a021.jpg","GOPR0958_JPG.rf.b5c79aa1ff0597abe64a00f2c845c334.jpg"],["GOPR0959_JPG.rf.5aa35c1f8ab9d78bc9139ad085d95a14.jpg","GOPR0960_JPG.rf.6d7970e79a4018449b0fff90fc4fbb44.jpg","GOPR0961_JPG.rf.a2b23082557a3d371a755b1c9c4c3ee9.jpg","GOPR0962_JPG.rf.7d33e3487528205d27dddc6c6389fd3a.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR2175_JPG.rf.860e411d4f14281a4521774c6f5b79f6.jpg","GOPR2176_JPG.rf.333501bf6f0c2c2d413e18614ff30f65.jpg","GOPR2177_JPG.rf.1f86bd7f53661762b407c20a5c25ece2.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR2184_JPG.rf.ec001f1518a49a9619df719bc05219c5.jpg","GOPR2185_JPG.rf.998876fe661ed29a8a09423651271fa0.jpg","GOPR2186_JPG.rf.a2ec80b72ffa4e56fdfbc22b99672ec1.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR2211_JPG.rf.6b935109804ae4f05eb497eebf4e7a6d.jpg","GOPR2222_JPG.rf.e997fa9e4aec19c6577b4bb97cc1d1b5.jpg","GOPR2233_JPG.rf.0fe63862e4ce3c4c459adb1e03b484d2.jpg"],["GOPR2283_JPG.rf.49edcef28b4be2f93098fc85741f8cd1.jpg","GOPR2284_JPG.rf.8e937c849d8819c3f493cfe8279bbe66.jpg","GOPR2285_JPG.rf.2f89eca6e5d49aebd215733829cb49d3.jpg","GOPR2286_JPG.rf.ac42f286743b40f6cd8f69b015c79f06.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["GOPR2292_JPG.rf.f763ee619b69efa0b481ccb78a3cfe0c.jpg","GOPR2293_JPG.rf.4c2590e704bfd60ceed4a6a7f432328e.jpg","GOPR2294_JPG.rf.3601fa01a0d7037ca2a44331d900348e.jpg","GOPR2295_JPG.rf.ff369e5b0fed563f9d194345f3a62993.jpg"],["GOPR2305_JPG.rf.08f29364e065ca4d4cd12cda682daa51.jpg","GOPR2306_JPG.rf.be1bf964a79f91c963b35b8cdb90b57f.jpg","GOPR2307_JPG.rf.88feb73a2c9b7f64ef341dde5e35a1cd.jpg","GOPR2308_JPG.rf.1be1c4aafe75ae7ea8c7d0c580e6d1e7.jpg"]],
  [["G0030412_JPG.rf.aee989756be7f401518dc929dcb04f33.jpg","G0030413_JPG.rf.83ad55fcb15bb399447771deefb5f4cd.jpg","G0030414_JPG.rf.328e91fcd7de5714fe411415575649df.jpg","G0030415_JPG.rf.f32baf5dc70e0fc4f346ac1e9d45eb62.jpg"],["GOPR2305_JPG.rf.08f29364e065ca4d4cd12cda682daa51.jpg","GOPR2306_JPG.rf.be1bf964a79f91c963b35b8cdb90b57f.jpg","GOPR2307_JPG.rf.88feb73a2c9b7f64ef341dde5e35a1cd.jpg","GOPR2308_JPG.rf.1be1c4aafe75ae7ea8c7d0c580e6d1e7.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR2316_JPG.rf.44b73cae837538c2de7e2d78a362419b.jpg","GOPR2317_JPG.rf.d54799e82dcea54a6f9394c91a60b7a3.jpg","GOPR2318_JPG.rf.3dc9fd8af7e1a8858f2b3d07f8108f2d.jpg"],["GOPR1006_JPG.rf.0ef26a5b616a8526affc3d5252ce91ae.jpg","GOPR1007_JPG.rf.1f6dd711914ade94c0e85e4635ffa32e.jpg","GOPR1009_JPG.rf.737f20bbfbe4cb35b7db131dfe9f6d72.jpg","GOPR1010_JPG.rf.5471a4a55739a7553af64c3653c70753.jpg"],["GOPR0965_JPG.rf.9c7c555124edfcee0c4af00332e36d9c.jpg","GOPR0966_JPG.rf.7167fc069ea8e89206870d31003f6a67.jpg","GOPR0967_JPG.rf.86ba00ebb709d39ddfad21b9181a233a.jpg","GOPR0969_JPG.rf.986d26a36e32a806f9c482f8c680a1a9.jpg"],["GOPR0936_JPG.rf.d5c112cc43e3ac52033640be47c5bff7.jpg","GOPR0937_JPG.rf.cd3ccd563a12b66a95fdaf1b32b03f4b.jpg","GOPR0938_JPG.rf.bbf7e7a24cfc88f6c63cd315284f4299.jpg","GOPR0939_JPG.rf.8a235cb7d7730b4d1110a4b61d5ee8ed.jpg"],["GOPR0921_JPG.rf.7f0112e796a8a8196342adc2ac6e02c7.jpg","GOPR0922_JPG.rf.77c34cd0f3b9075037edba0ab681e1ba.jpg","GOPR0923_JPG.rf.f44c7f84cf84829bc298222135dc1323.jpg","GOPR0924_JPG.rf.490db2b7665ddbd181e9f65c7f904349.jpg"],["GOPR0901_JPG.rf.3a40486ab622d285cbca6d16ae2f32fd.jpg","GOPR0907_JPG.rf.a1a81273440c58d0de0e492a71f4a668.jpg","GOPR0908_JPG.rf.5b6bf77e25bca7a21349a686f44514f6.jpg","GOPR0909_JPG.rf.1c86dc5cabe793ed8c687c43c16f12a8.jpg"],["GOPR0891_JPG.rf.5de580ca3a6ee789d3db984c3e85fb70.jpg","GOPR0892_JPG.rf.0db728d9195d0ff2bcd4454574f96559.jpg","GOPR0893_JPG.rf.14a6dce82954b50807888cb0ec2e6ef3.jpg","GOPR0894_JPG.rf.7a6899387b5c596f5f7875764467c7a2.jpg"]],
  [["GOPR0880_JPG.rf.58786de5310cd62568d726630407d902.jpg","GOPR0882_JPG.rf.0ea2bc34c4e9bcfad443311e4ae4a39e.jpg","GOPR0883_JPG.rf.8edddd20bcdfcc8a37bf63b71d05c4cf.jpg","GOPR0884_JPG.rf.6b99319008295e2d8993b22475cda5a7.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["GOPR0870_JPG.rf.dc5b14848d26fff424b0fe143afdf108.jpg","GOPR0871_JPG.rf.efaac9b210abf6dad2e074a733d62c3c.jpg","GOPR0872_JPG.rf.b85ee758940fd64b826ddcd8de1e73d9.jpg","GOPR0873_JPG.rf.3ae7136addf1b2908a08c03c4b70ec4f.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","GOPR0874_JPG.rf.e789a31742de56481c1d8212bee3d99a.jpg","GOPR0875_JPG.rf.1f916e00bb5eb5f907e627848a950b8b.jpg"],["GOPR0860_JPG.rf.38221bf36820abc8f0dd2766728d8bf7.jpg","GOPR0861_JPG.rf.a7e83571af8c2323e27bd99e8277cabc.jpg","GOPR0862_JPG.rf.d1060d80331347977739cb79285deed8.jpg","GOPR0863_JPG.rf.e36a639eb43bed5b4128989a79593441.jpg"],["GOPR0848_JPG.rf.05d9c14dece6f5d6ef5e1e08cf135ee6.jpg","GOPR0849_JPG.rf.f0688aefcad09747e9823e4e49ddce92.jpg","GOPR0850_JPG.rf.2a440aedca100fe5639e4d445f62421e.jpg","GOPR0851_JPG.rf.85f048c851916fde538abedaefe3410d.jpg"],["GOPR2228_JPG.rf.bfc275a503d6e3596bf4fa37de7706b3.jpg","GOPR2229_JPG.rf.2bbd4b9c77e0d39c88127e43dd9b40e0.jpg","GOPR2230_JPG.rf.d765ae8e34ea982b3c0cf6f11b190078.jpg","GOPR2231_JPG.rf.7155cc0c8cd3e8867ec571a92384e657.jpg"],["GOPR2283_JPG.rf.49edcef28b4be2f93098fc85741f8cd1.jpg","GOPR2284_JPG.rf.8e937c849d8819c3f493cfe8279bbe66.jpg","GOPR2285_JPG.rf.2f89eca6e5d49aebd215733829cb49d3.jpg","GOPR2286_JPG.rf.ac42f286743b40f6cd8f69b015c79f06.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","GOPR2305_JPG.rf.08f29364e065ca4d4cd12cda682daa51.jpg","GOPR2306_JPG.rf.be1bf964a79f91c963b35b8cdb90b57f.jpg"]],
  [["GOPR0721_JPG.rf.96cf90370f4abeff6e1df8159eced782.jpg","GOPR0722_JPG.rf.961de70b7b237d1801374b6f4fc56424.jpg","GOPR0723_JPG.rf.f5474da77b3183ded60c513a73a7a627.jpg","GOPR0727_JPG.rf.3cb92d91b48b86dda63ccbbe28186c12.jpg"],["GOPR0695_JPG.rf.2d2e1425f33b039e3ba10eacc68c3448.jpg","GOPR0696_JPG.rf.7706833df1238c2a42a6e5308f9e887a.jpg","GOPR0697_JPG.rf.f5555ea1a41a65b7303500ffc6b5710c.jpg","GOPR0698_JPG.rf.6dbbde9265f9d8252743b5bb4eb69418.jpg"],["GOPR0682_JPG.rf.e3157a717631c6982dc1eebb47d9f6ab.jpg","GOPR0683_JPG.rf.0b3fd7aa69e53cef2a0ddd4238b76d29.jpg","GOPR0684_JPG.rf.806aa6983a46d7d3aa1b1ef5f46dc05e.jpg","GOPR0685_JPG.rf.ecd0845f6b88c6c86db385ee70e9b261.jpg"],["GOPR0672_JPG.rf.6bf5eb390154cad2911c344ffd7bf349.jpg","GOPR0673_JPG.rf.d4ff437f51627b0eaabdec0c7897c5c0.jpg","GOPR0674_JPG.rf.891e97a19b21be6a9241ea911e347757.jpg","GOPR0675_JPG.rf.d5a9b40ad625f8ca4344eaba4a1625d1.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0662_JPG.rf.e9d81e5cf111f231658e57c193d7feda.jpg","GOPR0663_JPG.rf.39bbe8611d0b8d30908bada2f99977d7.jpg","GOPR0664_JPG.rf.325ec10652325be9b330de38607f9854.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0698_JPG.rf.6dbbde9265f9d8252743b5bb4eb69418.jpg","GOPR0700_JPG.rf.4803c5df01a873ea73e430b4c72a582a.jpg","GOPR0701_JPG.rf.07e6563019acb1f5cc63f7b8be613f2f.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0686_JPG.rf.f3c4d0982bc5958b288034d8f0a3631f.jpg","GOPR0687_JPG.rf.892060074ef74eeedff9c1fc06bbc49d.jpg","GOPR0688_JPG.rf.886bba9c50ee00f6940b551a9b862bfe.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"]],
  [["GOPR0661_JPG.rf.8933c3936b5d5e00e59eb47413b0c508.jpg","GOPR0662_JPG.rf.e9d81e5cf111f231658e57c193d7feda.jpg","GOPR0663_JPG.rf.39bbe8611d0b8d30908bada2f99977d7.jpg","GOPR0664_JPG.rf.325ec10652325be9b330de38607f9854.jpg"],["GOPR0633_JPG.rf.f61aa0755420f6f3585c6b2d02c9dafa.jpg","GOPR0634_JPG.rf.ae4924833662c2023473c20d73359b96.jpg","GOPR0635_JPG.rf.cb9566646a67ce815dda79b49ccdd072.jpg","GOPR0636_JPG.rf.fc22c1e6d15537360f0f860aa04ffe79.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","G0030419_JPG.rf.578fd128872631e2ff5ba0562cb41f7f.jpg","G0030420_JPG.rf.adcbdcd794440bc8703b617998aca7ff.jpg","G0030421_JPG.rf.434306532d213c142f5f8eabfaa21417.jpg"],["GOPR0618_JPG.rf.3773ac990ffa8f5f7498fe07399fbedb.jpg","GOPR0619_JPG.rf.2e4a77281ddb9b146e51eb17f26a3c0a.jpg","GOPR0620_JPG.rf.03a5beaee3be2749441c6c71342d980c.jpg","GOPR0621_JPG.rf.4684ddec9126b12e5552f219f5d998d6.jpg"],["GOPR0607_JPG.rf.8b6ab20e60faefc6654cce7fe28ee8ea.jpg","GOPR0608_JPG.rf.f327332fa9e6769843699a1ad559a9ce.jpg","GOPR0609_JPG.rf.e8a19e571588e21303355939154ea16b.jpg","GOPR0610_JPG.rf.0ab7a94f0c091945b3ba8988ead1a310.jpg"],["GOPR0591_JPG.rf.5491c0d7a2f3e6a5ad580f518cd0f81f.jpg","GOPR0592_JPG.rf.a63723fa98608a2bfea24c2a3cc5766e.jpg","GOPR0593_JPG.rf.b892bb8e128e5d5a1b04159fc4d1512d.jpg","GOPR0594_JPG.rf.c501c6dacf633d52082cf30ea58d3039.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0577_JPG.rf.02481cd0b70e5ad0982996992d240217.jpg","GOPR0578_JPG.rf.89f61ef379fb284b0e8e8bd6583a8ca2.jpg","GOPR0579_JPG.rf.4a5bf83d3ad3a327fb0170f445e3a9e6.jpg"],["G0030418_JPG.rf.4ae59891a8ce92de49f77659d6e54c26.jpg","GOPR0563_JPG.rf.d975b8625e71485f6a09bb0c8ba812c8.jpg","GOPR0564_JPG.rf.e72a63b5848b80ee9edfb9f0071692f5.jpg","GOPR0568_JPG.rf.02b6f5a14dd886b1c38e54d98ffc77b1.jpg"],["GOPR2338_JPG.rf.19435c96baad2e9d51babc9f72b0c812.jpg","GOPR2339_JPG.rf.c1dd4c3590adf1a81811c2f6bc07dd0a.jpg","GOPR2340_JPG.rf.1e31d2b998ba14272a5d6a59defce545.jpg","GOPR2341_JPG.rf.0e6cd2df88a61b70963c8077ecfb0695.jpg"]],
];

interface ZoneSpecies {
  name: string;
  percentage: number;
}

interface ZoneData {
  zone: number;
  infestation: number;
  weedCount: number;
  dominantWeed: string;
  species: ZoneSpecies[];
  heatmapCells: number[];
}

const mockZones: ZoneData[] = [
  { zone: 1, infestation: 12, weedCount: 34, dominantWeed: "Amaranthus",
    species: [{ name: "Amaranthus retroflexus", percentage: 52 }, { name: "Digitaria sanguinalis", percentage: 30 }, { name: "Portulaca oleracea", percentage: 18 }],
    heatmapCells: [5, 15, 8, 20, 10, 5, 12, 18, 6] },
  { zone: 2, infestation: 28, weedCount: 89, dominantWeed: "Cyperus",
    species: [{ name: "Cyperus rotundus", percentage: 45 }, { name: "Echinochloa crus-galli", percentage: 35 }, { name: "Amaranthus retroflexus", percentage: 20 }],
    heatmapCells: [25, 30, 20, 35, 40, 28, 15, 22, 30] },
  { zone: 3, infestation: 8, weedCount: 22, dominantWeed: "Digitaria",
    species: [{ name: "Digitaria sanguinalis", percentage: 60 }, { name: "Portulaca oleracea", percentage: 40 }],
    heatmapCells: [3, 8, 5, 10, 12, 6, 4, 9, 7] },
  { zone: 4, infestation: 35, weedCount: 112, dominantWeed: "Amaranthus",
    species: [{ name: "Amaranthus retroflexus", percentage: 48 }, { name: "Cyperus rotundus", percentage: 30 }, { name: "Echinochloa crus-galli", percentage: 22 }],
    heatmapCells: [30, 40, 35, 45, 50, 38, 25, 30, 28] },
  { zone: 5, infestation: 22, weedCount: 67, dominantWeed: "Echinochloa",
    species: [{ name: "Echinochloa crus-galli", percentage: 42 }, { name: "Amaranthus retroflexus", percentage: 33 }, { name: "Cyperus rotundus", percentage: 25 }],
    heatmapCells: [18, 22, 25, 20, 30, 22, 15, 18, 20] },
  { zone: 6, infestation: 18, weedCount: 51, dominantWeed: "Cyperus",
    species: [{ name: "Cyperus rotundus", percentage: 50 }, { name: "Digitaria sanguinalis", percentage: 30 }, { name: "Portulaca oleracea", percentage: 20 }],
    heatmapCells: [12, 18, 20, 15, 25, 18, 10, 15, 22] },
  { zone: 7, infestation: 42, weedCount: 138, dominantWeed: "Amaranthus",
    species: [{ name: "Amaranthus retroflexus", percentage: 55 }, { name: "Echinochloa crus-galli", percentage: 25 }, { name: "Cyperus rotundus", percentage: 20 }],
    heatmapCells: [40, 50, 45, 55, 60, 48, 35, 42, 38] },
  { zone: 8, infestation: 15, weedCount: 43, dominantWeed: "Digitaria",
    species: [{ name: "Digitaria sanguinalis", percentage: 45 }, { name: "Portulaca oleracea", percentage: 35 }, { name: "Amaranthus retroflexus", percentage: 20 }],
    heatmapCells: [10, 15, 12, 18, 20, 15, 8, 12, 14] },
  { zone: 9, infestation: 9, weedCount: 25, dominantWeed: "Echinochloa",
    species: [{ name: "Echinochloa crus-galli", percentage: 55 }, { name: "Digitaria sanguinalis", percentage: 45 }],
    heatmapCells: [4, 8, 6, 10, 14, 8, 5, 9, 7] },
];

const ZONE_LABELS = [
  "Top Left", "Top Center", "Top Right",
  "Middle Left", "Middle Center", "Middle Right",
  "Bottom Left", "Bottom Center", "Bottom Right",
];

const getSeverityColor = (rate: number) => {
  if (rate > 35) return "text-destructive";
  if (rate > 20) return "text-warning";
  return "text-success";
};

const getBorderColor = (rate: number) => {
  if (rate > 35) return "border-destructive/60";
  if (rate > 20) return "border-warning/60";
  return "border-success/60";
};

const getOverlayBg = (rate: number) => {
  if (rate > 35) return "rgba(220, 38, 38, 0.25)";
  if (rate > 20) return "rgba(234, 179, 8, 0.22)";
  return "rgba(34, 197, 94, 0.2)";
};

const getHeatColor = (intensity: number) => {
  if (intensity > 40) return "bg-destructive/70";
  if (intensity > 25) return "bg-warning/60";
  if (intensity > 10) return "bg-accent/40";
  return "bg-success/30";
};

const FieldImageReconstruction = () => {
  const mostInfested = mockZones.reduce((max, z) => z.infestation > max.infestation ? z : max, mockZones[0]);
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(mostInfested);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const getImageForCell = (zoneIdx: number, blockIdx: number, imgIdx: number) => {
    const filename = ZONE_IMAGES[zoneIdx]?.[blockIdx]?.[imgIdx] ?? ZONE_IMAGES[0][0][0];
    return `${import.meta.env.BASE_URL}my_field_d/zone_${zoneIdx + 1}/block_${blockIdx + 1}/${filename}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Field Reconstruction — Image Mosaic View
      </h3>
      <p className="text-xs text-muted-foreground -mt-2">
        9 zones · 9 blocks per zone · Click a zone to inspect its images
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Image mosaic grid — 1 cover image per zone */}
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border shadow-elevated bg-card">
          <div className="grid grid-cols-3 gap-[2px] p-[2px]">
            {mockZones.map((z, zoneIdx) => {
              const isSelected = selectedZone?.zone === z.zone;
              return (
                <motion.button
                  key={zoneIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + zoneIdx * 0.05 }}
                  onClick={() => setSelectedZone(isSelected ? null : z)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${getBorderColor(z.infestation)} ${
                    isSelected ? "ring-2 ring-primary z-10 border-2" : "border hover:ring-1 hover:ring-primary/50"
                  }`}
                >
                  {/* 3x3 block grid inside zone */}
                  <div className="grid grid-cols-3 gap-[1px]">
                    {Array.from({ length: 9 }, (_, blockIdx) => (
                      <div key={blockIdx} className="grid grid-cols-2 gap-[0.5px]">
                        {Array.from({ length: 4 }, (_, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={getImageForCell(zoneIdx, blockIdx, imgIdx)}
                            alt=""
                            className="w-full aspect-square object-cover"
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Heatmap color overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: getOverlayBg(z.infestation) }} />
                  {/* Zone label overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-opacity hover:bg-black/10">
                    <span className="text-[10px] font-bold text-white drop-shadow-md">Z{z.zone}</span>
                    <span className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">{z.infestation}%</span>
                    <span className="text-[9px] font-medium text-white/90 drop-shadow-md">{z.weedCount} weeds</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selectedZone ? (
            <motion.div
              key={selectedZone.zone}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-xl border bg-card p-5 shadow-card self-start"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">Zone {selectedZone.zone}</h4>
                  <span className="text-xs text-muted-foreground">{ZONE_LABELS[selectedZone.zone - 1]}</span>
                </div>
                <button onClick={() => setSelectedZone(null)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedZone.weedCount}</p>
                    <p className="text-[10px] text-muted-foreground">total weeds</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className={`text-sm font-bold ${getSeverityColor(selectedZone.infestation)}`}>{selectedZone.infestation}%</p>
                    <p className="text-[10px] text-muted-foreground">infested</p>
                  </div>
                </div>
              </div>

              {/* Block 5 detected images for selected zone */}
              <div className="mb-4">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                  <ZoomIn className="h-3 w-3" /> Block 5 — Model Detections
                </p>
                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                  {ZONE_IMAGES[selectedZone.zone - 1][4].map((filename, imgIdx) => {
                    const src = `${import.meta.env.BASE_URL}my_field_detected/zone_${selectedZone.zone}/${filename}`;
                    return (
                      <img
                        key={imgIdx}
                        src={src}
                        alt={`Detection ${imgIdx + 1}`}
                        className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        loading="lazy"
                        decoding="async"
                        onClick={(e) => { e.stopPropagation(); setZoomedImage(src); }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Density Distribution
                </p>
                <div className="grid grid-cols-3 gap-0.5 rounded-lg overflow-hidden">
                  {selectedZone.heatmapCells.map((cell, i) => (
                    <div key={i} className={`h-6 ${getHeatColor(cell)} flex items-center justify-center`}>
                      <span className="text-[8px] font-bold text-foreground/70">{cell}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> Species Breakdown
                </p>
                <div className="space-y-2">
                  {selectedZone.species.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-foreground italic truncate max-w-[65%]">{s.name}</span>
                        <span className="text-xs font-bold text-muted-foreground">{s.percentage}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full bg-primary/70"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center rounded-xl border border-dashed bg-card/50 p-8 text-center self-start min-h-[200px]"
            >
              <p className="text-sm text-muted-foreground">
                Click a zone on the mosaic to view its detailed analysis
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zoomed image modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoomedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={zoomedImage}
              alt="Zoomed field image"
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 rounded-full bg-card p-2 text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FieldImageReconstruction;
