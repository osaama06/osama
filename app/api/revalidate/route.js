import { revalidatePath } from "next/cache"


export async function POST (request){


    const body = await request.json()

    revalidatePath("/products")

}


