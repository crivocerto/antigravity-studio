import { supabase } from "./src/lib/supabase";

async function testFetch() {
  const { data: posts, error: postsError } = await supabase.from("posts").select("*");
  console.log("Posts Error:", postsError);
  console.log("Posts Data:", posts);

  const { data: categories, error: catsError } = await supabase.from("categories").select("*");
  console.log("Categories Error:", catsError);
  console.log("Categories Data:", categories);
}

testFetch();
