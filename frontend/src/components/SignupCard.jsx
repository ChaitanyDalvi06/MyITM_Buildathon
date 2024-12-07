import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Select,
	Checkbox
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		isStudent: false,
		school: "",
		programs: "",
		batch: ""
	});

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Full name</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
										value={inputs.name}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
										value={inputs.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type='email'
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								value={inputs.email}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
									value={inputs.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Are you a student?</FormLabel>
							<Checkbox
								onChange={(e) => setInputs({ ...inputs, isStudent: e.target.checked })}
								isChecked={inputs.isStudent}
								style={{ display: "block" }} // Force visibility
							>
								Yes
							</Checkbox>
						</FormControl>
						{
							inputs.isStudent && (
								<>
									<FormControl isRequired>
										<FormLabel>School</FormLabel>
										<Select
											name="schools"
											id="schools"
											onChange={(e) => setInputs({ ...inputs, school: e.target.value })}
											value={inputs.school}
										>
											<option value={""}>Select School</option>
											<option value={"SFT"}>SFT</option>
											<option value={"Business School"}>Business School</option>
										</Select>
									</FormControl>
									<FormControl isRequired>
										<FormLabel>Programs</FormLabel>
										<Select
											name="programs"
											id="programs"
											onChange={(e) => setInputs({ ...inputs, programs: e.target.value })}
											value={inputs.programs}
										>
											{
												inputs.school === "SFT" && (
													<>
														<option value={"BTech"}>BTech</option>
													</>
												)
											}
											{
												inputs.school === "Business School" && (
													<>
														<option value={"BBA"}>BBA</option>
														<option value={"MBA"}>MBA</option>
													</>
												)
											}
										</Select>
									</FormControl>
									{
										inputs.programs.includes("Btech") && (
											<FormControl isRequired>
												<FormLabel>Batch</FormLabel>
												<Select
													name="batch"
													id="batch"
													onChange={(e) => setInputs({ ...inputs, batch: e.target.value })}
													value={inputs.batch}
												>
													<option value={"Steve Jobs"}>Steve Jobs</option>
													<option value={"Elon Musk"}>Elon Musk</option>
													<option value={"Mark Zuckerberg"}>Mark Zuckerberg</option>
													<option value={"Jensen Huang"}>Jensen Huang</option>
												</Select>
											</FormControl>
										)
									}
								</>
							)
						}

						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Submitting'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
