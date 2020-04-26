const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' });
};

export default formatDate;
