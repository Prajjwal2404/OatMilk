import { Link } from "react-router-dom"

export const faqs = [
    {
        id: 0,
        category: "oatmilk",
        question: <p><strong>Why Oats?</strong></p>,
        answer: <p>Oats are an incredibly nutritious food packed with important vitamins, minerals and antioxidants. Compared to other grains, they're high in fiber and protein. SO, the real question is, Why not oats!</p>
    },
    {
        id: 1,
        category: "oatmilk",
        question: <p><strong>What is OatMilk?</strong></p>,
        answer: <p>OatMilk is a plant-based milk derived from whole oat grains by extracting the plant material with water. It has a creamy texture and a subtle flavour. It is consumed to replace dairy milk and given we are India's very own OatMilk - you can feel proud while drinking too!</p>
    },
    {
        id: 2,
        category: "oatmilk",
        question: <p><strong>Is it Vegan? Gluten-free?</strong></p>,
        answer: <p>OatMilk is vegan, yes and technically it is gluten free as well. Reason we say technical is because oats don't naturally contain gluten. There might be small traces, if at all, due to cross-contamination in the fields where oats are grown or through processing and packaging facilities. We doubt that might be the case but it is always important to check twice before saying once.</p>
    },
    {
        id: 3,
        category: "oatmilk",
        question: <p><strong>What are OatMilk ingredients?</strong></p>,
        answer: <p>It is mostly oats and water, followed by a few other things for the right nutritional balance and the creamy mouthfeel we all love! To break this down, it would be approximately - oats - 10%; water - 88%; canola oil, calcium and guar gum - 2%. Basically, tasty, healthy, goodness!</p>
    },
    {
        id: 4,
        category: "oatmilk",
        question: <p><strong>How do you make milk from oats?</strong></p>,
        answer: <p>It's fairly simple and magical. It's done in three stages. First stage is pulverising oats with water and filtering out what we call the oat base. Then essential minerals are added to ensure the right nutritional balance before pushing it to the last stage where the bottles are heat treated before reaching your doorstep. To know more in detail, click <Link to='/process'>here.</Link></p>
    },
    {
        id: 5,
        category: "oatmilk",
        question: <p><strong>Can I consume OatMilk if I am lactose intolerant?</strong></p>,
        answer: <p>We recommend you to consume OatMilk if you're lactose intolerant. Being lactose free, OatMilk is the healthiest and tastiest option out there for you. Enjoy all the dishes/beverages you avoided with confidence now. Also, we would like you to know that more people are lactose intolerant than not. So don't single yourself out like that. You are lactose normal and the human body is NOT made to digest lactase.</p>
    },
    {
        id: 6,
        category: "usage",
        question: <p><strong>Do I need to boil OatMilk before using?</strong></p>,
        answer: <p>No, as our OatMilk is already pasteurized, it's perfectly fine to use it directly from the bottle. You can if you want to but it is not needed. But please remember to shake well before use.</p>
    },
    {
        id: 7,
        category: "usage",
        question: <p><strong>What can I use OatMilk for?</strong></p>,
        answer: <p>OatMilk is extremely versatile. Here's a few uses to get you started - <br />
            1. When in doubt, add it to your coffee. <br />
            2. Make some more coffee. <br />
            3. Did we mention coffee? <br />
            4. Add some to a banana cake or any other cake of your choice, we already believe in your choices :) <br />
            5. Whip up some pancakes. <br />
            6. And the obvious, milkshakes, breakfast bowls, smoothies, cereal, and whatever else you do with your milk, we can do it all. <br />
            7. Also boss, OatMilk CHAI important hai! <br />
            8. There's always that looming thought of pasta. <br />
            9. Also, we scream for some ICE CREAM! Apologies, for being dramatic but come on, it's ice cream! There's a lot more you can do with it. Share your creative recipes with us and tag us on instagram! We shall make sure we share it with the world :)</p>
    },
    {
        id: 8,
        category: "usage",
        question: <p><strong>Can I heat/freeze OatMilk?</strong></p>,
        answer: <p>Of course you can! Don't let anyone tell you otherwise.</p>
    },
    {
        id: 9,
        category: "usage",
        question: <p><strong>How long does it last?</strong></p>,
        answer: <p>The shelf life for OatMilk is 12 months. However, once opened, we recommend refrigerating and consuming within 3-5 days but from our experience, that hasn't ever been an issue. Our OatMilk, once opened, is devoured in minutes.</p>
    },
    {
        id: 10,
        category: "usage",
        question: <p><strong>Can I cook with OatMilk?</strong></p>,
        answer: <p>Yes, you can! Cook whatever your heart desires with it. Also, we are extremely excited about whatever you come up with so do share your recipes with us on <a href='https://www.instagram.com/oatsbynush' target='_blank' aria-label='instagram'>Instagram</a> or drop us an <a href='mailto:info@oatsbynush.com' target='_blank' aria-label='email'>email.</a></p>
    },
    {
        id: 11,
        category: "delivery",
        question: <p><strong>Why can I buy only cases of 12 bottles from the website?</strong></p>,
        answer: <p>For us, availability is a key focus. We are working night and day to make OatMilk available at your nearest store so you can go and pick it up right now! This way, you can try our product and if you like it, you can order a crate for just yourselves so you don't have to go through the hassle and in doing so, also enjoy a 10% discount! OatMilk also has a 12 month shelf-life so you don't have to worry about wastage - you know you'll be back very soon ordering a couple more!</p>
    },
    {
        id: 12,
        category: "delivery",
        question: <p><strong>How long does it take to get OatMilk?</strong></p>,
        answer: <p>You can order from our <Link to='/buy'>website</Link> and OatMilk shall be with you in 7-10 business days!</p>
    },
    {
        id: 13,
        category: "delivery",
        question: <p><strong>Where can I find OatMilk?</strong></p>,
        answer: <p>We are currently in Kathmandu city and are growing our coverage as you read this.</p>
    },
    {
        id: 14,
        category: "nutritional",
        question: <p><strong>How healthy is OatMilk?</strong></p>,
        answer: <p>Health is our top focus. We have about 35% protein. Yes, you read that right! We also have a good amount of carbs to make sure the milk is filling. Basically, we have tried to extract the best nutritional value out there, be it dairy milk or otherwise. You can learn a bit more in detail by clicking right <Link to='/product'>here!</Link></p>
    },
    {
        id: 15,
        category: "nutritional",
        question: <p><strong>How much protein, fiber and calcium is there?</strong></p>,
        answer: <p>Per 100ml, OatMilk has 6.59g of protein, bringing the total to a whopping 32.95g of protein per bottle, way more than a regular protein bar or shake. Also, we have 1.38g of fiber and 230.76mg of calcium per 100ml.</p>
    },
    {
        id: 16,
        category: "nutritional",
        question: <p><strong>Does it contain added sugars?</strong></p>,
        answer: <p>No no! We don't like to add unnecessary things to OatMilk. You see, oats have natural sugars, the kind they are born with. We just use this natural sweetness to our advantage, to make OatMilk as yummy as ever!</p>
    },
    {
        id: 17,
        category: "nutritional",
        question: <p><strong>Why does OatMilk taste sweet if there aren't any added sugars?</strong></p>,
        answer: <p>We will try to not make it scienc-y because no one wants to get bored. But essentially, oats have starch, which with the magic of processing, can be broken down into 'simpler' sugars, the ones that enhance the natural sweetness oats are born with. Hence, the yummy sweetness!</p>
    },
    {
        id: 18,
        category: "sustainability",
        question: <p><strong>What does being a sustainable business mean to OatMilk?</strong></p>,
        answer: <p>We believe in a better tomorrow wherein we can produce healthy, tasty food, without harming our natural resources in the process. That for us is OatMilk. To learn more, click <Link to='/environment'>here!</Link></p>
    },
    {
        id: 19,
        category: "sustainability",
        question: <p><strong>Why is OatMilk packaged in glass bottles?</strong></p>,
        answer: <p>Glass is one of the most sustainable packaging materials that can be reused and recycled efficiently. Personally, we have lots of plants growing in them, some have yummy jams, marmalades and chutneys in them, some serve as nightlights and one is even our 'happiness bottle' with trinkets of fun memories :D</p>
    },
    {
        id: 20,
        category: "sustainability",
        question: <p><strong>Where is OatMilk sourced from?</strong></p>,
        answer: <p>OatMilk is made locally in India. This allows for less land usage, low carbon emissions and allows us to bring you your favourite liquid oats as fresh as they come!</p>
    },
    {
        id: 21,
        category: "sustainability",
        question: <p><strong>How does OatMilk compare to dairy/other milks?</strong></p>,
        answer: <p>OatMilk has one of the least amount of environmental impact compared to dairy/other milks. Specifically, it uses 80% less land, produces less than one-third the greenhouse gas emissions and uses just 4% of the water required to produce one-litre of dairy milk. Read <a href="https://theconversation.com/which-milk-is-best-for-the-environment-we-compared-dairy-nut-soy-hemp-and-grain-milks-147660" target="_blank" aria-label="the-conversation">more!</a></p>
    }
]