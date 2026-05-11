import bcrypt from 'bcryptjs';

for (let i = 1; i <= 8; i++) {
	let pass = `hashed_pw_${i}`;
	let hash = await bcrypt.hash(pass, 10);
	console.log(`Hash for ${pass}:`, hash);

	console.log(await bcrypt.compare(pass, "$2a$10$isCdaZVeVf4ekrVEOz/EmeSyLt79lZpqeLiO3scWeJRvsbf4GNyfe")); //
}