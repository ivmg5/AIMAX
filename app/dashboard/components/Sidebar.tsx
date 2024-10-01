"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PreferenceProps, PreferencePropsWithSession } from "../page";
import { Check, Minus, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { changePreferences } from "@/app/lib/preferences";

interface PreferenceCardProps {
	tags: { name: string; id: string }[];
	title: string;
	editable: boolean;
	onChange: (tags: { name: string; id: string }[]) => void;
}

function PreferenceCard({
	tags,
	title,
	editable,
	onChange,
}: PreferenceCardProps) {
	const handleAdd = () => {
		onChange([...tags, { name: "", id: Date.now().toString() }]);
	};

	const handleRemove = () => {
		onChange(tags.slice(0, tags.length - 1));
	};

	const handleChange = (index: number, newValue: string) => {
		const updatedTags = tags.map((tag, i) =>
			i === index ? { ...tag, name: newValue } : tag
		);
		onChange(updatedTags);
	};

	const handleDelete = (index: number) => {
		const updatedTags = tags.filter((_, i) => i !== index);
		onChange(updatedTags);
	};

	return (
		<div className='text-white '>
			<div
				className={`text-xl flex w-full items-center ${
					editable && "justify-between"
				}`}
			>
				<div className='my-1'>{title}</div>
				{editable && (
					<div className='flex gap-1'>
						<button
							onClick={handleRemove}
							className='flex justify-center items-center hover:cursor-pointer hover:bg-black/10 p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
						>
							<Minus size={20} />
						</button>
						<button
							onClick={handleAdd}
							className='flex justify-center items-center hover:cursor-pointer hover:bg-black/10 p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
						>
							<Plus size={20} />
						</button>
					</div>
				)}
			</div>
			<div className='interestContainer bg-logo rounded-lg flex justify-between'>
				<div className='flex flex-col p-2 w-fit max-w-80'>
					{editable
						? tags.map((tag, index) => (
								<div className='flex justify-center items-center hover:bg-black/20 p-1 rounded-xl group'>
									<input
										type='text'
										className='bg-transparent border-none outline-none text-white placeholder:text-white/80  '
										key={tag.id}
										value={tag.name}
										onChange={(e) => handleChange(index, e.target.value)}
									/>
									<button
										onClick={() => handleDelete(index)}
										className='group-hover:opacity-100 opacity-0 hover:cursor-pointer p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
									>
										<X size={14} />
									</button>
								</div>
						  ))
						: tags.map((tag) => (
								<div className='mr-3' key={tag.id}>
									{tag.name}
								</div>
						  ))}
				</div>
			</div>
		</div>
	);
}

const comparePreferences = (
	original: { name: string; id: string }[],
	current: { name: string; id: string }[]
) => {
	const newPreferences = current.filter(
		(item) => !original.some((orig) => orig.id === item.id)
	);
	const removedPreferences = original.filter(
		(item) => !current.some((curr) => curr.id === item.id)
	);
	return { newPreferences, removedPreferences };
};

function Sidebar({
	priorities,
	reasons,
	interest,
	knowledge,
	session,
}: PreferencePropsWithSession) {
	const [editable, setEditable] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [prioritiesParams, setPrioritiesParams] = useState(priorities);
	const [reasonsParams, setReasonsParams] = useState(reasons);
	const [interestParams, setInterestParams] = useState(interest);
	const [knowledgeParams, setKnowledgeParams] = useState(knowledge);

	// Temporary states to store the original values
	const [tempPriorities, setTempPriorities] = useState(priorities);
	const [tempReasons, setTempReasons] = useState(reasons);
	const [tempInterests, setTempInterests] = useState(interest);
	const [tempKnowledge, setTempKnowledge] = useState(knowledge);

	const handleEdit = () => {
		setEditable(true);
		setTempPriorities(prioritiesParams);
		setTempReasons(reasonsParams);
		setTempInterests(interestParams);
		setTempKnowledge(knowledgeParams);
	};

	const handleCancel = () => {
		setEditable(false);
		setPrioritiesParams(tempPriorities);
		setReasonsParams(tempReasons);
		setInterestParams(tempInterests);
		setKnowledgeParams(tempKnowledge);
	};

	const handleSave = async () => {
		setDisabled(true);

		if (!session || !session.user || !session.user.id) {
			handleCancel();
			return;
		}

		const newPreferences = {
			priorities: comparePreferences(tempPriorities, prioritiesParams)
				.newPreferences,
			reasons: comparePreferences(tempReasons, reasonsParams).newPreferences,
			interests: comparePreferences(tempInterests, interestParams)
				.newPreferences,
			knowledge: comparePreferences(tempKnowledge, knowledgeParams)
				.newPreferences,
		};

		const removedPreferences = {
			priorities: comparePreferences(tempPriorities, prioritiesParams)
				.removedPreferences,
			reasons: comparePreferences(tempReasons, reasonsParams)
				.removedPreferences,
			interests: comparePreferences(tempInterests, interestParams)
				.removedPreferences,
			knowledge: comparePreferences(tempKnowledge, knowledgeParams)
				.removedPreferences,
		};

		try {
			await changePreferences(
				session.user.id,
				newPreferences,
				removedPreferences
			);
		} catch (error) {
			handleCancel();
			console.error(error);
		}

		setDisabled(false);
		setEditable(false);
	};

	return (
		<div className='flex flex-col'>
			<div className='flex justify-end text-white'>
				{editable ? (
					<>
						<div
							className='hover:cursor-pointer hover:bg-black/10 p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
							onClick={handleSave}
						>
							<Check />
						</div>
						<button
							disabled={disabled}
							className='hover:cursor-pointer hover:bg-black/10 p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
							onClick={handleCancel}
						>
							<X />
						</button>
					</>
				) : (
					<button
						disabled={disabled}
						onClick={handleEdit}
						className='hover:cursor-pointer hover:bg-black/10 p-1 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
					>
						<Pencil />
					</button>
				)}
			</div>
			<ScrollArea className='w-fit flex-1 h-full'>
				<PreferenceCard
					tags={prioritiesParams}
					title='Priorities'
					editable={editable}
					onChange={setPrioritiesParams}
				/>
				<PreferenceCard
					tags={reasonsParams}
					title='Reasons for Learning'
					editable={editable}
					onChange={setReasonsParams}
				/>
				<PreferenceCard
					tags={interestParams}
					title='Interests'
					editable={editable}
					onChange={setInterestParams}
				/>
				<PreferenceCard
					tags={knowledgeParams}
					title='Knowledge'
					editable={editable}
					onChange={setKnowledgeParams}
				/>
			</ScrollArea>
		</div>
	);
}

export default Sidebar;
