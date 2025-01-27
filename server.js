import express, { response } from "express";
import env from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
env.config();

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

// Get all category 
app.get("/category", async (_, response) => {
    try {
        const { data, error } = await supabase.from("category").select();

        console.log(data);

        return response.send(data);
    } catch (error) {
        return response.send({ error });
    }
});

// Get Category details by name 
app.get('/category-by-name/:name', async (req, res) => {
    const { data, error } = await supabase.from("category").select().eq("name", req.params.name);
    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data);
})


// Get category details by id
app.get('/category-by-id/:id', async (req, res) => {
    const { data, error } = await supabase.from('category').select().eq("id", req.params.id);
    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data);
})



// Get All sub-categories
app.get("/sub-category", async (_, response) => {
    try {
        const { data, error } = await supabase.from("subcategory").select();

        console.log(data);

        return response.send(data);
    } catch (error) {
        return response.send({ error });
    }
});


// Get All subcategories under a Category
app.get("/sub-category/:category", async (req, res) => {

    const { data, error } = await supabase.from('subcategory').select().eq("category_id", req.params.category)

    if (error) {
        return res.send(error);
    }
    else {
        return res.status(200).send(data);
    }
})





// Get subcategory details by name
app.get("/sub-category-name/:name", async (req, res) => {
    console.log(req.params.name)
    const { data, error } = await supabase.from('subcategory').select().eq('name', req.params.name);
    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data);

})



// Get subcategory details by id
app.get("/sub-category-by-id/:id", async (req, res) => {
    console.log(req.params.id)
    const { data, error } = await supabase.from('subcategory').select().eq('id', req.params.id);
    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data);

})



// Get all items
app.get("/item", async (_, response) => {
    try {
        const { data, error } = await supabase.from("item").select();

        console.log(data);

        return response.send(data);
    } catch (error) {
        return response.send({ error });
    }
});


// Get Item details by name
app.get("/item-by-name/:name", async (req, res) => {
    const { data, error } = await supabase.from("item").select().eq("name", req.params.name)

    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data)
})


// Get All items under a category
app.get("/item-category/:category", async (req, res) => {
    const { data, error } = await supabase.from("item").select().eq("category_id", req.params.category)

    if (error) {
        return res.send(error);
    }
    return res.status(200).send(data)
})


// Get all items under a subcategory 
app.get("/item-subcategory/:subcategory", async (req, res) => {
    const { data, error } = await supabase.from("item").select().eq("sub_category_id", req.params.subcategory)

    if (error) {
        res.send(error);
    }
    return res.status(200).send(data);
})




// Creating Category
app.post('/category', async (req, res) => {
    const { name, image, description, tax_applicability, tax, tax_type } = req.body;

    const { data, error } = await supabase
        .from('category')
        .insert([{ name, image, description, tax_applicability, tax, tax_type }]);

    if (error) return res.status(400).json({ success: false, error });
    res.status(201).json({ success: true, data });
});


// Create Sub-category
app.post('/sub-category', async (req, res) => {
    const { name, image, description, category_id, tax_applicability, tax } = req.body;


    const { data, error } = await supabase
        .from('subcategory')
        .insert(name, image, description, category_id, tax_applicability, tax);

    if (error) return res.status(400).json({ success: false, error });
    res.status(201).json({ success: true, data });
});


// Create Item 
app.post('/items', async (req, res) => {
    console.log(req.body)
    const { name, image, description, base_amount, discount, category_id, sub_category_id, tax_applicability, tax } = req.body;


    const total_amount = base_amount - discount;
    const { data, error } = await supabase
        .from('item')
        .insert([{ name, image, description, base_amount, discount, category_id, sub_category_id, tax, total_amount, tax_applicability }])
    if (error) {
        res.status(400).json(error)
    }

    res.status(201).json({ success: true, data });
});






// Edit Item
app.post('/item/:id', async (req, res) => {
    const { name, image, description, base_amount, discount, category_id, sub_category_id, tax_applicability, tax } = req.body;

    console.log(req.params);
    const { data, error } = await supabase.from('item').update({ name, image, description, base_amount, discount, category_id, sub_category_id, tax_applicability, tax }).eq("id", req.params.id);

    if (error) res.send("not updated")
    return res.status(200).send("done")

})

// Edit Category
app.post('/category/:id', async (req, res) => {
    const { name, image, description, tax_applicability, tax, tax_type } = req.body;

    console.log(req.params);
    const { data, error } = await supabase.from('category').update({ name, image, description, tax_applicability, tax, tax_type }).eq("id", req.params.id);

    if (error) res.send("not updated")
    return res.status(200).send("done")

})


// Edit Subcategory
app.post('/sub-category/:id', async (req, res) => {
    const { name, image, description, category_id, tax_applicability, tax } = req.body;

    console.log(req.params);
    const { data, error } = await supabase.from('subcategory').update({ name, image, description, tax_applicability, tax, category_id }).eq("id", req.params.id);

    if (error) res.send("not updated")
    return res.status(200).send("done")

})



// search items with name
app.get('/search-item/:name', async (req, res) => {
    try {
        const searchQuery = `%${req.params.name}%`;
        const { data, error } = await supabase
            .from('item')
            .select()
            .ilike('name', searchQuery);

        if (error) {
            return res.status(400).send({ error: error.message });
        }

        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'An internal server error occurred' });
    }
});



app.listen(process.env.PORT, () =>
    console.log(
        new Date().toLocaleTimeString() +
        `: Server is running on port ${process.env.PORT}...`
    )
);
